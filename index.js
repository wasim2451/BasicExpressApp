const express=require('express');
const data=require('./MOCK_DATA.json')
const fs=require('fs');


const app=express();
app.use(express.urlencoded({extended:false}))
//It is used to parse the form data . It gets data information from the headers .
app.use(express.json());
//It is used to parse JSON type data .
//Data type comes from request headers.


app.get('/api/users',(req,res)=>{
  res.setHeader("myName","HelloWorld")
  //Always add X to custom headers a Good Practice.
  console.log(req.headers);
  return res.json(data);
})

app.get('/users',(req,res)=>{
    const html=`
    <ul>
        ${data.map((user)=>{
            return `
            <li>${user.first_name}</li>
            `
            }).join('')}
    </ul>
    `
    return res.send(html);
})

app.post('/api/users',(req,res)=>{
    const body=req.body;
    data.push({...body,id:data.length+1})
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    return res.status(201).json(data); // 201 Created

})

app.route('/api/users/:id')
.get((req,res)=>{
    const id=Number(req.params.id);
    const userData=data.find((user)=>user.id===id);
    if(userData){
        return res.json(userData);
    }
    else{
        const err=new Error('User not found');
        throw err;
    }
})
.patch((req,res)=>{
    //patch is used to update the specific field of the user
    //Id will come from request
    const id=Number(req.params.id);
    //Data will come from request body
    const editedBody=req.body;;

    //Map the User data and find the specific user with that id
    const userIndex = data.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    data[userIndex]={...data[userIndex],...editedBody};

   
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });

    return res.status(200).json(data);
})
.delete((req,res)=>{
  // get the id from the request url
  const id=Number(req.params.id);
  //use filter 
  const newSetofData=data.filter((user)=>user.id!=id);
  // If there is no change in length then user is found
  if(newSetofData.length===data.length){
    throw new Error('User does not exist !');
  }
  //Append to the Existing data
  data.push({...data,newSetofData})
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    return res.json(data);
  
    
})





app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});