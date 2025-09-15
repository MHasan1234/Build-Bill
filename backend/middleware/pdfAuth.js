// import jwt from "jsonwebtoken";

// // This is a special version of 'protect' just for the PDF route
// export const protectPdfRoute = (req, res, next) => {
//     let token;

//     // 1. Check for token in Authorization header
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
//         token = req.headers.authorization.split(" ")[1];
//     } 
//     // 2. If not in header, check for token in query parameters
//     else if (req.query.token) {
//         token = req.query.token;
//     }

//     if (!token) {
//         return res.status(401).json({ message: "No token, access denied" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// };