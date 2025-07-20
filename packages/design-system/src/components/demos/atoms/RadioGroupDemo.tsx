import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import RadioGroup from '../../atoms/RadioGroup';

const RadioGroupDemo: React.FC = () => {
  const [sizeValue, setSizeValue] = useState('medium');
  const [orientationValue, setOrientationValue] = useState('option2');
  const [paymentValue, setPaymentValue] = useState('card');

  const sizeOptions = [
    { value: 'small', label: 'Pequeño', description: 'Para espacios reducidos' },
    { value: 'medium', label: 'Medio', description: 'Tamaño estándar recomendado' },
    { value: 'large', label: 'Grande', description: 'Para mayor visibilidad' }
  ];

  const orientationOptions = [
    { value: 'option1', label: 'Opción 1' },
    { value: 'option2', label: 'Opción 2' },
    { value: 'option3', label: 'Opción 3' }
  ];

  const paymentOptions = [
    { 
      value: 'card', 
      label: 'Tarjeta de crédito', 
      description: 'Visa, Mastercard, American Express'
    },
    { 
      value: 'paypal', 
      label: 'PayPal', 
      description: 'Pago seguro con tu cuenta PayPal'
    },
    { 
      value: 'transfer', 
      label: 'Transferencia bancaria', 
      description: 'Transferencia directa a nuestra cuenta'
    },
    { 
      value: 'cash', 
      label: 'Efectivo', 
      description: 'Pago en efectivo al recibir el servicio',
      disabled: true
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Typography variant="h4">Grupo básico vertical:</Typography>
        <RadioGroup
          name="size-selection"
          value={sizeValue}
          onChange={setSizeValue}
          options={sizeOptions}
        />
        <div className="bg-neutral-100 p-3 rounded-lg">
          <Typography variant="p" size="sm">
            <strong>Seleccionado:</strong> {sizeValue}
          </Typography>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Orientación horizontal:</Typography>
        <RadioGroup
          name="orientation-selection"
          value={orientationValue}
          onChange={setOrientationValue}
          options={orientationOptions}
          orientation="horizontal"
        />
        <div className="bg-neutral-100 p-3 rounded-lg">
          <Typography variant="p" size="sm">
            <strong>Seleccionado:</strong> {orientationValue}
          </Typography>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Con descripciones y estados:</Typography>
        <RadioGroup
          name="payment-method"
          value={paymentValue}
          onChange={setPaymentValue}
          options={paymentOptions}
        />
        <div className="bg-neutral-100 p-3 rounded-lg">
          <Typography variant="p" size="sm">
            <strong>Método de pago seleccionado:</strong> {paymentValue}
          </Typography>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Tamaños disponibles:</Typography>
        <div className="space-y-6">
          <div>
            <Typography variant="p" size="sm" weight="medium" className="mb-3">Tamaño pequeño:</Typography>
            <RadioGroup
              name="size-small"
              value="small"
              onChange={() => {}}
              options={[
                { value: 'small', label: 'Ejemplo pequeño' },
                { value: 'other', label: 'Otra opción' }
              ]}
              size="sm"
            />
          </div>
          
          <div>
            <Typography variant="p" size="sm" weight="medium" className="mb-3">Tamaño mediano (default):</Typography>
            <RadioGroup
              name="size-medium"
              value="medium"
              onChange={() => {}}
              options={[
                { value: 'medium', label: 'Ejemplo mediano' },
                { value: 'other', label: 'Otra opción' }
              ]}
              size="md"
            />
          </div>
          
          <div>
            <Typography variant="p" size="sm" weight="medium" className="mb-3">Tamaño grande:</Typography>
            <RadioGroup
              name="size-large"
              value="large"
              onChange={() => {}}
              options={[
                { value: 'large', label: 'Ejemplo grande' },
                { value: 'other', label: 'Otra opción' }
              ]}
              size="lg"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h4">Estado deshabilitado:</Typography>
        <RadioGroup
          name="disabled-example"
          value="option1"
          onChange={() => {}}
          options={[
            { value: 'option1', label: 'Opción seleccionada' },
            { value: 'option2', label: 'Opción no disponible' }
          ]}
          disabled
        />
      </div>
    </div>
  );
};

export default RadioGroupDemo;