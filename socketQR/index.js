const express=require('express');
const app=express();
const path=require('path');
const ws=require('ws').Server;
const mysql=require('mysql');
const bodyParser=require('body-parser');
const cors=require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

function returnHash(){
    abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    var token=""; 
    for(i=0;i<32;i++){
         token += abc[Math.floor(Math.random()*abc.length)];
    }
    return token; //Will return a 32 bit "hash"
}

var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'tesQR'
})

app.get('/',(req,res,next)=>{
    res.status(200).send('response ok');
})

app.post('/login',(req,res,next)=>{
    if(!req.headers['content-type']){
        res.setHeader('Content-Type','application/json');
        res.status(404).send({status:'error'});
    }
    else{
        let nim=req.body.nim;
        let password=req.body.password;
        connection.query(`SELECT * FROM mahasiswa WHERE mahasiswa.NIM='${nim}';`,(err,rows,field)=>{
            if (err) throw err;
            if(rows.length===0){
                res.setHeader('Content-Type','application/json');
                res.status(404).send({status:'error'});
            }
            else{
                if(password===rows[0].Password){
                    res.setHeader('Content-Type','application/json');
                    let token=returnHash();
                    connection.query(`UPDATE mahasiswa SET token='${token}' WHERE mahasiswa.NIM='${rows[0].NIM}';`,(err,result,fields)=>{
                        //console.log(result);
                        let payload={
                            status:'success',
                            token:token,
                            NIM:rows[0].NIM,
                            Nama:rows[0].Nama,
                            Jenjang:rows[0].Jenjang,
                            Prodi:rows[0].Prodi,
                            
                        }
                        res.status(202).send(payload);
                    });
                   
                }
                else{
                    res.setHeader('Content-Type','application/json');
                    res.status(404).send({status:'error'});
                }
            }
        })
    }
})

const server=app.listen(8080,()=>{
    console.log('server listen to port 8080');
})

let desktop={};
let mobile={};

let socket=new ws({server});

//let i=setInterval(()=>{
//    index=Object.keys(mobile);
//    for(i=0;i<1;i++){
//       mobile[index[i]].send('muehehehe');
//    }   
//},10000)

socket.on('connection',(client,req)=>{
    try{
        let split=req.url.match(/type=(.+)/)[1];
    if(split==='desktop'){
        clientid=req.url.match(/clientid=([^&]+)/)[1];
        console.log(`desktop ${clientid} connected`);
        desktop[clientid]=client;

        client.on('close',()=>{
            console.log(`desktop ${clientid} closed`);
            delete desktop[clientid];
        })

    }
    if(split==='mobile'){
        token=req.url.match(/token=([^&]+)/)[1];
        nim=req.url.match(/nim=([^&]+)/)[1];
        //console.log(nim);
        if(token!=='undefined' && nim !== 'undefined'){
            console.log(`mobile ${nim} connected`);
            mobile[nim]=client;
            //console.log(Object.keys(mobile));

            client.on('close',()=>{
                console.log(`mobile ${nim} closed`);
                delete mobile[nim];
            })

        }

    }

    client.on('error',()=>{
        client.OPEN();
    })


    client.on('message',(args)=>{
        let parse=JSON.parse(args);
        console.log(parse);
        if(parse.xhrType==='scannedQRfromMobile'){
            try{
                Object.keys(desktop).forEach((res)=>{
                    desktop[res].send(JSON.stringify(parse));
                })
            }
            catch(err){
                console.log(err);
            }
           
        }
        if(parse.xhrType==='sendSuccesLoad'){
            console.log(parse);
            try{
                mobile[parse.nim].send(JSON.stringify({
                    xhrType:'toStatusScreen',
                    params:'SUKSES PRESENSI'
                }));
            }
            catch(err){
                delete mobile[parse.nim];
            }
        }

        if(parse.xhrType==='sendFailureLoad'){
            try{
                mobile[parse.nim].send(JSON.stringify({
                    xhrType:'toStatusScreen',
                    params:'GAGAL PRESENSI'
                }));
            }
            catch(err){
                delete mobile[parse.nim];
            }
        }
    })

    }
    catch(err){
        console.log(err);
    }
    

    socket.on('error',()=>{
        socket=new ws({server});
    })
})