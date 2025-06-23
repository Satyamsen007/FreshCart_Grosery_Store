import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  brand: {
    type: String,
  },
  variants: [
    {
      weight: {
        type: String,
        required: true
      },
      regularPrice: {
        type: Number,
        required: true
      },
      discountPrice: {
        type: Number,
        validate: {
          validator: function (value) {
            return value < this.regularPrice;
          },
          message: 'Discount price must be lower than regular price'
        }
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
      },
      shippingFee: {
        type: Number,
        default: 0,
      },
      isDiscountActive: {
        type: Boolean,
        default: false
      },
      discountExpires: {
        type: Date,
        default: function () {
          return this.discountPrice ? new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) : undefined;
        }
      }
    }
  ],
  taxRate: {
    type: Number,
    default: 0, // percentage e.g. 5 => 5%
  },
  reviews: [
    {
      reviewCustommer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      reviewComment: {
        type: String,
        required: true,
        trim: true
      },
      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
  ],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  unitsSold: {
    type: Number,
    default: 0
  },
  salesHistory: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      quantity: {
        type: Number,
        required: true
      },
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product.variants'
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Check if discount is valid for a variant
productSchema.methods.checkDiscount = function (variantIndex) {
  const variant = this.variants[variantIndex];
  return variant.discountPrice && variant.discountExpires > new Date();
};

// Update discount status for all variants before saving
productSchema.pre('save', function (next) {
  this.variants.forEach((variant, index) => {
    variant.isDiscountActive = this.checkDiscount(index);
  });
  next();
});

// Method to update product rating
productSchema.methods.updateRating = async function () {
  const reviews = this.reviews || [];
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / reviews.length;
    this.totalReviews = reviews.length;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }

  // Use findOneAndUpdate instead of save to handle concurrent updates
  await this.constructor.findOneAndUpdate(
    { _id: this._id },
    {
      $set: {
        averageRating: this.averageRating,
        totalReviews: this.totalReviews
      }
    },
    { new: true }
  );
};

// Pre-save middleware to ensure rating is updated when reviews change
productSchema.pre('save', async function (next) {
  if (this.isModified('reviews')) {
    try {
      await this.updateRating();
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Add indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;    