export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only Admins can access this",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message: 'Server Error in admin middleware'
    })
  }
};
