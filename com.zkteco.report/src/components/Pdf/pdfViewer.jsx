import { useEffect, React} from 'react';
import { PDFViewer, StyleSheet } from '@react-pdf/renderer';
import PdfPage from '.';

const styles = StyleSheet.create({
    PDFViewer: {
      display:'flex',
      width: '100%',
      border: 'none',
      height: '50vh'
    } 
  });

function PdfTest({ data }) {
  
  return (
    <div>
      <PDFViewer style={styles.PDFViewer}  >
        <PdfPage data={data} />
      </PDFViewer>
    </div>
  );
}

export default PdfTest;