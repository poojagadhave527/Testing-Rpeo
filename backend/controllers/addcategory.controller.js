import { Category } from "../models/Category.model.js";

const addCategoryController = async (req, res) => {

    const { name, status } = req.body;
    const existing= await Category.findOne({ name: name });

    if (existing) {
        const category = new Category({ name, status });
        const response = await category.save();

        if (response) {
            return res.status(200).json({ message: "Category added successfully", category });

        }
        else {
            return res.status(400).json({ message: "Category not added" });
        }
        
    }else{
        return res.status(400).json({ message: "Category already exists" });
    }
    
        

    


}
export default addCategoryController;

