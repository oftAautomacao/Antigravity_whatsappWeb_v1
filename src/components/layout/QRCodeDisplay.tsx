import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
    qrCode: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCode }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-light text-gray-700 mb-6">Conectar ao WhatsApp</h2>
            <div className="p-4 bg-white border-2 border-gray-100 rounded-lg">
                <QRCodeSVG value={qrCode} size={256} />
            </div>
            <div className="mt-8 text-center text-gray-600">
                <ol className="text-left list-decimal space-y-2 ml-4">
                    <li>Abra o WhatsApp no seu celular</li>
                    <li>Toque em <strong>Menu</strong> ou <strong>Configurações</strong> e selecione <strong>Aparelhos Conectados</strong></li>
                    <li>Toque em <strong>Conectar um aparelho</strong></li>
                    <li>Aponte seu celular para esta tela para capturar o código</li>
                </ol>
            </div>
        </div>
    );
};

export default QRCodeDisplay;
