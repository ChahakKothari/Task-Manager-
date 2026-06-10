const mongoose = require('mongoose');

const inviteCodeSchema = new mongoose.Schema(
  {
    codeHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    usedByEmail: {
      type: String,
      default: '',
    },
    usedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

inviteCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('InviteCode', inviteCodeSchema);