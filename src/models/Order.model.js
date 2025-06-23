import mongoose from "mongoose";
import Product from "./Product.model";

// Function to update product stock, sales history, and units sold
const updateProductStockAndSales = async function (items) {
  try {
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      // Find the variant in the product
      const variant = product.variants.id(item.variantId);
      if (!variant) continue;

      // Check if there's enough stock
      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name} - ${variant.weight}`);
      }

      // Update stock
      variant.stock -= item.quantity;

      // Update units sold
      product.unitsSold += Number(item.quantity);

      // Add to sales history
      product.salesHistory.push({
        variantId: item.variantId,
        quantity: item.quantity,
        saleDate: new Date(),
        price: variant.discountPrice || variant.regularPrice
      });

      // Save the product changes
      await product.save();
    }
  } catch (error) {
    console.error('Error updating product stock and sales:', error);
    throw error;
  }
};

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      },
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'unpaid', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['ordered', 'order confirm', 'shipped', 'out for delivery', 'delivered', 'cancelled'],
    default: 'ordered'
  },
  shippingInfo: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    }
  }
}, { timestamps: true })

// Pre-save hook to handle order confirmation and payment
orderSchema.pre('save', async function (next) {
  // Only proceed if status is being changed to 'order confirm' and payment is 'paid'
  const isStatusChanged = this.isModified('status') && this.status === 'delivered';
  const isPaymentPaid = this.paymentStatus === 'paid';

  if (isStatusChanged && isPaymentPaid) {
    try {
      await updateProductStockAndSales(this.items);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Check if model exists before compiling it
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;