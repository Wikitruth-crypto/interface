'use client';

import React, { useState, useEffect } from 'react';
import {
  // Col, 
  Card
} from 'antd';
import styles from './styles.module.scss';
import CountrySelectorCreate from '@Create/components/countrySelectorCreate';
import DateSelector2 from '@Create/components/dateSelectorCreate';
import InputArea from '@Create/components/inputAreaCreate';
import RadioApp from '@Create/components/radioSelectCreate';
import ImageUpload from '@Create/components/imageUploadCreate';
import FileUpload from '@Create/components/fileUploadCreate';
import { InputTitleCreate } from '@Create/components/inputTitleCreate';
import { InputPriceCreate } from '@Create/components/inputPriceCreate';
import { InputTypeOfCrime } from '@Create/components/inputTypeOfCrime';
import { InputNftOwner } from '@Create/components/inputNftOwner';
import MintingContainer from '../components/mintButton';
import InputLabel from '@Create/components/inputLabel';
import { CheckAccount } from '@Create/components/checkAccount';
import { useNFTCreateStore } from '@Create/store/useNFTCreateStore';
import { cn } from '@/lib/utils';
import { Container } from '@/components/Container';


const FormContainer: React.FC = () => {

  const [showPriceBar, setShowPriceBar] = useState(false);

  const boxInfoForm = useNFTCreateStore(state => state.boxInfoForm)
  // const boxInfoForm = useNFTCreateStore(state => state.boxInfoForm)

  useEffect(() => {
    if (boxInfoForm && boxInfoForm.mintMethod === 'create') {
      // setIsStoring(true);
      setTimeout(() => {
        setShowPriceBar(true);
      }, 50);
    } else {
      setShowPriceBar(false);

      setTimeout(() => {
        // setIsStoring(false);
      }, 300);
    }
  }, [boxInfoForm]);


  return (
    <Container>
      <CheckAccount />

      {/* <Col style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> */}
      <Card
        className={styles.formCard}
      >
        <div className="flex flex-col w-full space-y-2 gap-2">
          <InputTitleCreate />
          <InputArea />
          <CountrySelectorCreate />
          <DateSelector2 />
          <InputTypeOfCrime />
          <InputLabel />
          <InputNftOwner />
          <RadioApp />

          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            showPriceBar 
              ? "max-h-32 opacity-100 translate-y-0" 
              : "max-h-0 opacity-0 -translate-y-2"
          )}>
            <div className="py-2">
              <InputPriceCreate />
            </div>
          </div>

        </div>
      </Card>

      <Card
        className={styles.formCard}
        style={{ marginTop: '20px', marginBottom: '20px' }}
      >
        <div className="flex flex-col w-full space-y-2 gap-2">
          <ImageUpload />
          <FileUpload />

        </div>
      </Card>

      <div className="flex w-full py-4 mb-4 justify-center">
        <MintingContainer />
      </div>

      {/* </Col> */}
    </Container>
  );
};

export default FormContainer; 