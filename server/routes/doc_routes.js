import express from 'express';
import {generarEstDocumento, obtenerDocumentosCon, generarDocumento, corregirDocumento, updateEstDocument,deleteEstDocument, obtenerDocumentoConId ,ObtenerUsuarios, InsertarUsuarios, ActualizarUsuarios, EliminarUsuarios } from '../controllers/docController.js';


const router = express.Router();

router.post('/api/generateEst', generarEstDocumento);

router.get('/api/documentos', obtenerDocumentosCon);

router.get('/api/documentos/:id', obtenerDocumentoConId);

router.post('/api/generateDoc', generarDocumento);

router.post('/api/correct', corregirDocumento);

router.put('/api/documentos/:id', updateEstDocument);

router.delete('/api/documentos/:id', deleteEstDocument);

router.get('/api/users', ObtenerUsuarios);

router.post('/api/users', InsertarUsuarios);

router.put('/api/users/:id', ActualizarUsuarios);

router.delete('/api/users/:id', EliminarUsuarios);
 


export default router; 