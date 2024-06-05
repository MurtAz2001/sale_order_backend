const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());  // Add this line to parse JSON bodies

const readFileAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const writeFileAsync = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

app.get('/api/products', async (req, res) => {
  try {
    const data = await readFileAsync(path.join(__dirname, 'data', 'products.json'));
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading products data:', err);
    res.status(500).send('Error reading products data');
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const data = await readFileAsync(path.join(__dirname, 'data', 'customers.json'));
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading customers data:', err);
    res.status(500).send('Error reading customers data');
  }
});

app.get('/api/saleOrders', async (req, res) => {
  try {
    const data = await readFileAsync(path.join(__dirname, 'data', 'saleOrders.json'));
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading sale orders data:', err);
    res.status(500).send('Error reading sale orders data');
  }
});

// Add the POST endpoint
app.post('/api/saleOrders', async (req, res) => {
  try {
    const newOrder = req.body;
    const filePath = path.join(__dirname, 'data', 'saleOrders.json');
    
    const data = await readFileAsync(filePath);
    const saleOrders = JSON.parse(data);

    newOrder.id = saleOrders.length ? saleOrders[saleOrders.length - 1].id + 1 : 1;
    saleOrders.push(newOrder);

    await writeFileAsync(filePath, JSON.stringify(saleOrders, null, 2));
    
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error creating sale order:', err);
    res.status(500).send('Error creating sale order');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
