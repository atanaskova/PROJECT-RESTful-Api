const express=require("express");
const router=express.Router();
const categoriesController=require('../../../controllers/categories')

router
    .get('/',categoriesController.fetchAll)
    .post('/',categoriesController.create)
    .get('/:id',categoriesController.fetchOne)
    .put('/:id',categoriesController.putUpdate)
    .patch('/:id',categoriesController.patchUpdate)
    .delete('/:id',categoriesController.delete)

module.exports=router;