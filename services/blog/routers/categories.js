const express=require("express");
const router=express.Router();
const categoriesController=require('../../../controllers/categories')

router
    .get('/',categoriesController.fetchAll)
    .get('/:id',categoriesController.fetchOne)
    .post('/',categoriesController.create)
    .put('/:id',categoriesController.putUpdate)
    .patch('/:id',categoriesController.patchUpdate)
    .delete('/:id',categoriesController.delete)

module.exports=router;