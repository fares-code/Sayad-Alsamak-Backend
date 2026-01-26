const validateProductWholesalePricing = (req, res, next) => {
  try {
    const { type, wholesalePrice, minWholesaleQty, price } = req.body;

    // Check if wholesale pricing is required
    if ((type === 'WHOLESALE' || type === 'BOTH')) {
      if (!wholesalePrice || wholesalePrice === undefined) {
        return res.status(400).json({
          success: false,
          error: 'يجب تحديد سعر الجملة عند اختيار نوع جملة',
        });
      }

      if (!minWholesaleQty || minWholesaleQty === undefined) {
        return res.status(400).json({
          success: false,
          error: 'يجب تحديد الحد الأدنى لكمية الجملة عند اختيار نوع جملة',
        });
      }
    }

    // Validate wholesale price vs retail price
    if (wholesalePrice && price && wholesalePrice >= price) {
      return res.status(400).json({
        success: false,
        error: 'سعر الجملة يجب أن يكون أقل من سعر القطاعي',
      });
    }

    // Validate minimum wholesale quantity
    if (minWholesaleQty && minWholesaleQty < 1) {
      return res.status(400).json({
        success: false,
        error: 'الحد الأدنى لكمية الجملة يجب أن يكون أكبر من 1',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateProductWholesalePricing,
};
