const express = require('express');
const mongoose = require('mongoose');
const $apiName = 'Characters';
const Characters = require('../entity/entity.characters');
const charService = require('./business.characters.js')(Characters)




const app = express();
module.exports = (app) => {
  
  
  async function get (req, res) {
    const paramsId = req.params;
    try {
      const result = await charService.Get(paramsId)
      return res.status(200).send(result);
    }catch (err) {
      return res.status(500).send({ error: err.message });
      
    }
    
  }
  async function getAll(req,res){
    
    try {
      let query = {}
      const result = charService.GetAll(query)
      return res.status(200).send(result);
    }catch(err){
      return res.status(500).send({ error: err.message });
    }
  }

  async function getById(req,res){
    try {
      const result = await charService.GetById(req.params.id);
      return res.status(200).send(result);
    }catch(err) {
      return res.status(500).send({ error: err.message }); 
    }
  }
  
  async function add (req, res) {
    try {
      const newEquipment = new Characters(req.body);
      const result = await charService.Add(newEquipment)
      return res.status(200).send(result)
    }catch (err) {
      return res.status(500).send({error: err.message})
    }
    
  }
  async function deleteChar(req, res){
    try {
      const paramsId = req.params.id;
      const equipment = await charService.GetById(paramsId);

      if(!equipment){
        return res.status(404).send({ error : 'Characters not found'})
      }
      const result = await charService.Delete(paramsId);
      return res.status(200).send(result)
        
    }catch(err) {
      return res.status(500).send({ error: err.message})
      }
    }
    
    async function update(req, res){
        try {
          const user = req.decoded;
          const updateFields = req.body;
          const id =  req.params.id 
          const status = await charService.GetById(id);
          if (!status) {
            return res.status(404).send({ error: 'Status not found' });
          }
          const result = await charService.UpdateOne(id, updateFields);
          if (result === null){
            return res.status(404).send()
          }
          return res.status(200).send(result)
        }catch(err){
          return res.status(500).send({error : err.message})
        }
      };
    

    const router = require('express').Router();


    // get
    router.get(`/Characters/:id`, get)

    // getall
    router.get(`/Characters/`, getAll)

    // getById
    router.get(`/Characters/id/:id`, getById)

    // add
    router.post(`/Characters`, add);

    //delete
    router.delete(`/Characters/:id`, deleteChar);

    router.put(`/${$apiName}/:id`, update)

    return router;
      
  }
      
      //router.get(`/:id`, get);
      
  //router.delete('/:id', deleteItem);
