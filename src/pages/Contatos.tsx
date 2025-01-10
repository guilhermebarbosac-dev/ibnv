import { MapPin, Phone, Mail } from 'lucide-react'

export function Contatos() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Entre em Contato</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <MapPin className="w-6 h-6 text-secondary mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Endereço</h3>
              <p>Praça Amaro José do Carmo 100</p>
              <p>Santa Isabel</p>
              <p>Conceição das Alagoas, MG</p>
              <p>38120-000</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Phone className="w-6 h-6 text-secondary mt-1" />
            <div>
              <h3 className="font-semibold text-lg">WhatsApp</h3>
              <p>(34) 3327-0522</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Mail className="w-6 h-6 text-secondary mt-1" />
            <div>
              <h3 className="font-semibold text-lg">E-mail</h3>
              <p>ibnvcconceicao@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}