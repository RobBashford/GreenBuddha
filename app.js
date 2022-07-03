const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('./models/products');

mongoose.connect('mongodb://localhost:27017/gbp')
    .then(() => {
        console.log('MONGO: CONNECTION OPEN')
    })
    .catch(e => {
        console.log('MONGO: CONNECTION ERROR')
        console.log(e)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/products/collection', async (req, res) => {
    const products = await Product.find({});
    res.render('products/collection.ejs', { products })
})

app.get('/products/new', (req, res) => {
    res.render('products/new.ejs')
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/show.ejs', { product })
})

app.listen(3000, () => {
    console.log('APP IS LISTENING...')
})