const db = require('../db');

exports.getProducts = async (req, res) => {
  try {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (req.query.category) {
      sql += ' AND category = ?';
      params.push(req.query.category);
    }

    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sql += ' ORDER BY price ASC';
          break;
        case 'price_desc':
          sql += ' ORDER BY price DESC';
          break;
        case 'name_asc':
          sql += ' ORDER BY name ASC';
          break;
        case 'name_desc':
          sql += ' ORDER BY name DESC';
          break;
        case 'newest':
          sql += ' ORDER BY created_at DESC';
          break;
        default:
          sql += ' ORDER BY created_at DESC';
      }
    } else {
      sql += ' ORDER BY created_at DESC';
    }

    const [products] = await db.query(sql, params);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching products.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json(products[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching product.' });
  }
};