import React, { useState } from 'react';
import { Smartphone, Plus, Settings } from 'lucide-react';

const InstanceSwitcher: React.FC = () => {
    const [activeInstance, setActiveInstance] = useState(1);

    const instances = [
        { id: 1, name: 'Principal', color: 'bg-green-500' },
        { id: 2, name: 'Vendas', color: 'bg-blue-500' },
        { id: 3, name: 'Suporte', color: 'bg-purple-500' },
        { id: 4, name: 'Marketing', color: 'bg-yellow-500' },
    ];

    return (
        <div className="w-16 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4 gap-4">
            {instances.map((instance) => (
                <div
                    key={instance.id}
                    onClick={() => setActiveInstance(instance.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${activeInstance === instance.id
                            ? 'ring-2 ring-whatsapp-teal ring-offset-2'
                            : 'hover:bg-gray-200'
                        }`}
                    title={instance.name}
                >
                    <div className={`w-full h-full rounded-full flex items-center justify-center text-white ${instance.color}`}>
                        <Smartphone size={20} />
                    </div>
                </div>
            ))}

            <div className="mt-auto flex flex-col gap-4">
                <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-600" title="Adicionar Nova Instância">
                    <Plus size={24} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-600" title="Configurações">
                    <Settings size={20} />
                </button>
            </div>
        </div>
    );
};

export default InstanceSwitcher;
