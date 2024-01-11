import express from "express"
import { adminOnly } from "../middlewares/auth.js"
import { singleUpload } from "../middlewares/multer.js"
import { deleteProduct, getAllCategories, getAdminProducts, getLatestProducts, getSingleProduct, newProduct, updateProduct, getAllProducts, getSearchedProducts } from "../controllers/product.js"

const app = express.Router()

app.post("/new", adminOnly, singleUpload, newProduct)
app.get("/latest", getLatestProducts)
app.get("/category", getAllCategories)
app.get("/all", getAllProducts)
app.get("/", getSearchedProducts)
app.get("/admin-products", getAdminProducts)

app.route("/:id").get(getSingleProduct)
                .put(adminOnly, singleUpload, updateProduct)
                .delete(adminOnly, deleteProduct)

export default app