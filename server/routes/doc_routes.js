import express from 'express';
import {generarEstDocumento, obtenerDocumentosCon, generarDocumento} from '../controllers/docController.js';


const router = express.Router();

router.post('/api/generateEst', generarEstDocumento);

router.get('/api/documentos', obtenerDocumentosCon);

router.post('/api/generateDoc', generarDocumento);

export default router; 