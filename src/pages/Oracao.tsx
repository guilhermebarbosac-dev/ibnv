import { useState } from 'react';
import { useToastContext } from '../components/context/ToastContext';
import { User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import emailjs from '@emailjs/browser';

export function Oracao() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });
  const { addToast } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        'service_uit9zgc',
        'template_dxxexij',
        {
          to_email: 'ibnvconceicao@gmail.com',
          from_name: formData.nome,
          from_email: 'novavidaigrejbatista@gmail.com',
          email: formData.email,
          telefone: formData.telefone,
          mensagem: `Email: ${formData.email}\n\n${formData.mensagem}`
        },
        'hl30qpIwZa3gbqWCF'
      );

      addToast('Pedido de oração enviado com sucesso!', 'success');
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        mensagem: ''
      });
    } catch (error) {
      console.error('Error sending prayer request:', error);
      addToast('Erro ao enviar pedido de oração. Por favor, tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Entre em contato
          </h1>
          <p className="mt-5 text-xl text-gray-500">
            Estamos aqui para te ouvir e ficaremos felizes em poder ajudar!
          </p>
          <p className="mt-3 text-lg text-gray-500">
            Sinta-se à vontade para falar sobre o que desejar e, se preferir, entre em contato por outros canais também.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="telefone"
                id="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700">
              Mensagem
            </label>
            <div className="mt-1 relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="mensagem"
                id="mensagem"
                rows={6}
                required
                value={formData.mensagem}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Spinner /> : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 