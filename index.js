const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true })); // parse incoming requests with urlencoded payloads

app.use(bodyParser.json());


const getData = (req, res) => {
  try {
    const data = require('./mainData.json');
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error reading data');
  }
};
  
// define a route -that uses the getData handler function
app.get('/api/get_data', getData);
// define a route handler function that retrieves data

app.post('/api/data', (req, res) => {
  console.log(req.body); // logs the data sent in the POST request
  // res.send(req.body); // sends a response back to the client
  const data = req.body;

  // Write the data to a file
  fs.writeFile('mainData.json', JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data');
    } else {
      res.send('Data saved successfully');
    }
  });

});

// api/data_update

// route to handle PUT request to update data
app.put('/api/data_update/:id', (req, res) => {
  const idToUpdate = req.params.id; // id of object to update
  const updatedData = req.body; // updated object data

  // read existing data from file
  const data = JSON.parse(fs.readFileSync('./mainData.json'));

  // find the object to update by ID
  const objToUpdate = data.find(obj => obj.id == idToUpdate);

  if (!objToUpdate) {
    // if object not found, send 404 Not Found response
    res.status(404).send('Object not found');
    return;
  }

  // update the object
  Object.assign(objToUpdate, updatedData);

  // write the updated data back to the file
  fs.writeFileSync('./mainData.json', JSON.stringify(data));

  // send success response
  res.send('Data updated successfully');
});


// route to handle PUT request to update data
app.put('/api/data_update', (req, res) => {
  const idToUpdate = req.params.id; // id of object to update
  const updatedData = req.body; // updated object data

  // read existing data from file
  const data = JSON.parse(fs.readFileSync('./mainData.json'));

  // find the object to update by ID
  // const objToUpdate = data.find(obj => obj.id == idToUpdate);

  // if (!objToUpdate) {
  //   // if object not found, send 404 Not Found response
  //   res.status(404).send('Object not found');
  //   return;
  // }
  console.log('-----------------')
  console.log(updatedData , data)
  console.log('-----------------')
  // update the object
  let res1 = data.push(updatedData);
  console.log('res1' , res1)

  // write the updated data back to the file
  fs.writeFileSync('./mainData.json', JSON.stringify(data));

  // send success response
  res.send('Data updated successfully');
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});