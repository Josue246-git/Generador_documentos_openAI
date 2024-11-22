import express from 'express';
import {generarEstDocumento, obtenerDocumentosCon, generarDocumento, corregirDocumento, updateEstDocument,deleteEstDocument, obtenerDocumentoConId } from '../controllers/docController.js';


const router = express.Router();

router.post('/api/generateEst', generarEstDocumento);

router.get('/api/documentos', obtenerDocumentosCon);

router.get('/api/documentos/:id', obtenerDocumentoConId);

router.post('/api/generateDoc', generarDocumento);

router.post('/api/correct', corregirDocumento);

router.put('/api/documentos/:id', updateEstDocument);

router.delete('/api/documentos/:id', deleteEstDocument);

export default router; 