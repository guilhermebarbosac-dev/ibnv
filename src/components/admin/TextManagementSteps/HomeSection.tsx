import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { useToastContext } from '../../context/ToastContext';
import { FileText, Heart, Copy, Users, Coffee, Target, Instagram, Youtube, MapPin, Mail, Phone, BookOpen, Compass } from 'lucide-react';

interface TextInput {
  key: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'url';
  preview?: string;
}

interface HomeSectionProps {
  title: string;
  description: string;
  inputs: TextInput[];
  onComplete: () => void;
}

export function HomeSection({ title, description, inputs, onComplete }: HomeSectionProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    inputs.reduce((acc, input) => ({ ...acc, [input.key]: input.value }), {})
  );
  const { addToast } = useToastContext();

  useEffect(() => {
    fetchSectionData();
  }, [title]);

  const fetchSectionData = async () => {
    try {
      // Get all keys for the current section's inputs
      const keys = inputs.map(input => input.key);
      
      
      const { data, error } = await supabase
        .from('text_data')
        .select('*')
        .in('key', keys);

      if (error) throw error;

      if (data) {
        const sectionData = data.reduce((acc, item) => ({
          ...acc,
          [item.key]: item.value
        }), {});

        setFormData(prev => ({
          ...prev,
          ...sectionData
        }));
      }
    } catch (error) {
      console.error('Error fetching section data:', error);
      addToast('Erro ao carregar dados da seção', 'error');
    }
  };  


  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First, delete existing entries for the current keys
      const keys = inputs.map(input => input.key);

      const { error: deleteError } = await supabase
        .from('text_data')
        .delete()
        .in('key', keys);

      if (deleteError) throw deleteError;

      // Then insert new entries
      const promises = Object.entries(formData).map(([key, value]) => 
        supabase
          .from('text_data')
          .insert([{ key, value }])
      );

      await Promise.all(promises);
      addToast('Textos salvos com sucesso!', 'success');
      onComplete();
    } catch (error) {
      console.error('Error saving texts:', error);
      addToast('Erro ao salvar os textos', 'error');
    }
  };

  const renderHomePreview = () => {
    return (
      <div className="relative min-h-[400px] bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            {formData['home.title'] || 'Título Principal'}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            {formData['home.subtitle'] || 'Subtítulo'}
          </p>
          <button className="px-8 py-3 text-base font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors">
            {formData['home.button'] || 'Texto do Botão'}
          </button>
        </div>
      </div>
    );
  };

  const renderTransmissionPreview = () => {
    return (
      <div className="space-y-8">
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {formData['transmission.title'] || 'Título da Transmissão Ao Vivo'}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {formData['transmission.description'] || 'Descrição da Transmissão Ao Vivo'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {formData['youtube.title'] || 'Título do Canal do YouTube'}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {formData['youtube.description'] || 'Descrição do Canal do YouTube'}
          </p>
        </div>
      </div>
    );
  };

  const renderGenerosityPreview = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
              {formData['generosity.title'] || 'Título da Página'}
            </h1>
            <p className="text-gray-600 text-lg md:text-xl lg:text-xl">
              {formData['generosity.subtitle'] || 'Subtítulo'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
                {formData['generosity.content.title'] || 'Título do Conteúdo'}
              </h2>

              <div className="w-full max-w-md space-y-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-lg text-gray-600 mb-3">
                    {formData['generosity.content.card.title'] || 'Título do Cartão'}:
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-secondary select-all">
                      {formData['generosity.content.pix.key'] || 'Chave PIX'}
                    </p>
                    <button className="text-secondary hover:text-secondary-dark transition-colors">
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4">
                  <div className="relative w-full max-w-[300px] mx-auto">
                    <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-gray-500">QR Code PIX</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <img
                          src="/logo-black.png"
                          alt="Logo"
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-center text-gray-600 mt-4 mb-4">
                    {formData['generosity.content.qrCode.description'] || 'Descrição do QR Code'}
                  </p>
                  <button className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-secondary-dark transition duration-300">
                    Copiar código PIX
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGrowthTrackPreview = () => {
    return (
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            {formData['growth-track.title'] || 'Título da Página'}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {formData['growth-track.subtitle'] || 'Subtítulo'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden hover:bg-gray-50 transition-all duration-300">
            <div className="p-6">
              <div className="flex-1 space-y-2 justify-center items-center text-center">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="bg-secondary/10 p-4 rounded-xl shrink-0">
                    <Users className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-semibold">
                    {formData['growth-track.steps.title1'] || 'Título do Passo 1'}
                  </h3>
                </div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {formData['growth-track.steps.description1'] || 'Descrição do Passo 1'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden hover:bg-gray-50 transition-all duration-300">
            <div className="p-6">
              <div className="flex-1 space-y-2 justify-center items-center text-center">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="bg-secondary/10 p-4 rounded-xl shrink-0">
                    <Coffee className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-semibold">
                    {formData['growth-track.steps.title2'] || 'Título do Passo 2'}
                  </h3>
                </div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {formData['growth-track.steps.description2'] || 'Descrição do Passo 2'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden hover:bg-gray-50 transition-all duration-300">
            <div className="p-6">
              <div className="flex-1 space-y-2 justify-center items-center text-center">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="bg-secondary/10 p-4 rounded-xl shrink-0">
                    <Target className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-semibold">
                    {formData['growth-track.steps.title3'] || 'Título do Passo 3'}
                  </h3>
                </div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {formData['growth-track.steps.description3'] || 'Descrição do Passo 3'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <div className="bg-secondary/10 p-3 rounded-lg shrink-0">
              <BookOpen className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-center sm:text-left">
              {formData['growth-track.cet.title'] || 'CET - Centro de Estudos Nova Vida'}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="cursor-pointer group relative">
              <div className="bg-gray-50 rounded-xl p-12 flex flex-col justify-center items-center text-center gap-4 transition-colors duration-300">
                <h3 className="text-xl md:text-3xl font-semibold mb-2">
                  {formData['growth-track.cet.basic.title'] || 'CET Básico'}
                </h3>
                <p className="text-secondary font-medium text-lg md:text-xl mb-2">
                  {formData['growth-track.cet.basic.subtitle'] || 'Escola Maturidade Espiritual'}
                </p>
                <p className="text-gray-600 text-base md:text-lg">
                  {formData['growth-track.cet.basic.description'] || 'Fundamentos da fé e crescimento espiritual'}
                </p>
              </div>
            </div>

            <div className="cursor-pointer group relative">
              <div className="bg-gray-50 rounded-xl p-12 flex flex-col justify-center items-center text-center gap-4 transition-colors duration-300">
                <h3 className="text-xl md:text-3xl font-semibold mb-2">
                  {formData['growth-track.cet.intermediate.title'] || 'CET Intermediário'}
                </h3>
                <p className="text-secondary font-medium text-lg md:text-xl mb-2">
                  {formData['growth-track.cet.intermediate.subtitle'] || 'TLC (Treinamento de Líderes de Células)'}
                </p>
                <p className="text-gray-600 text-base md:text-lg">
                  {formData['growth-track.cet.intermediate.description'] || 'Formação de líderes e ministério celular'}
                </p>
              </div>
            </div>

            <div className="cursor-pointer group relative">
              <div className="bg-gray-50 rounded-xl p-12 flex flex-col justify-center items-center text-center gap-4 transition-colors duration-300">
                <h3 className="text-xl md:text-3xl font-semibold mb-2">
                  {formData['growth-track.cet.advanced.title'] || 'CET Avançado'}
                </h3>
                <p className="text-secondary font-medium text-lg md:text-xl mb-2">
                  {formData['growth-track.cet.advanced.subtitle'] || 'Teologia Bíblica'}
                </p>
                <p className="text-gray-600 text-base md:text-lg">
                  {formData['growth-track.cet.advanced.description'] || 'Aprofundamento teológico e ministerial'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAboutUsPreview = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
        <div className="mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {formData['who-we-are.title'] || 'Quem Somos'}
            </h1>
            <p className="text-lg text-gray-600">
              {formData['who-we-are.subtitle'] || 'Conheça nossa história e propósito'}
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col space-y-4">
            <div className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-secondary" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {formData['who-we-are.history.title'] || 'Nossa História'}
                </h2>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {formData['who-we-are.history.description'] || 'História da nossa igreja'}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-secondary" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {formData['who-we-are.mission.title'] || 'Nossa Missão'}
                </h2>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {formData['who-we-are.mission.description'] || 'Missão da nossa igreja'}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-secondary" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {formData['who-we-are.values.title'] || 'Nossos Valores'}
                </h2>
              </div>
              <ul className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                    <span className="text-sm text-gray-600">
                      {formData[`who-we-are.values.option${i}`] || `Valor ${i}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-secondary" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {formData['who-we-are.vision.title'] || 'Nossa Visão'}
                </h2>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {formData['who-we-are.vision.description'] || 'Visão da nossa igreja'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFooterPreview = () => {
    return (
      <div className="bg-black text-white p-20 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 text-center justify-center">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">
              {formData['footer.church.title'] || 'NOSSA IGREJA'}
            </h3>
            <div className="space-y-2 text-gray-400 text-lg">
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-6 h-6" />
                <span className="break-words">
                  {formData['footer.church.address'] || 'Praça Amaro José de Carmo, 100'}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-6 h-6" />
                <a href={`mailto:${formData['footer.contact.email']}`} className="hover:text-white transition-colors break-words">
                  {formData['footer.contact.email'] || 'ibnjconceicao@gmail.com'}
                </a>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-6 h-6" />
                <a href={`tel:${formData['footer.contact.phone']}`} className="hover:text-white transition-colors">
                  {formData['footer.contact.phone'] || '(34) 3327-0522'}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">
              {formData['footer.about.title'] || 'Sobre Nós'}
            </h3>
            <ul className="space-y-2">
              {formData['footer.about.links']?.split(',').map((link, index) => (
                <li key={index} className="text-gray-400 hover:text-white transition-colors text-lg">{link}</li>
              )) || (
                <>
                  <li className="text-gray-400 hover:text-white transition-colors text-lg">Quem Somos</li>
                  <li className="text-gray-400 hover:text-white transition-colors text-lg">Redes (ministérios)</li>
                  <li className="text-gray-400 hover:text-white transition-colors text-lg">Trilho de Crescimento</li>
                  <li className="text-gray-400 hover:text-white transition-colors text-lg">Agenda</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">
              {formData['footer.participate.title'] || 'Participe'}
            </h3>
            <ul className="space-y-2">
              {formData['footer.participate.links']?.split(',').map((link, index) => (
                <li key={index} className="text-gray-400 hover:text-white transition-colors text-lg">{link}</li>
              )) || (
                <>
                  <li className="text-gray-400 hover:text-white transition-colors text-lg">Oferte e Contribua</li>
                  <li className="text-gray-400 hover:text-white transition-colors text-lg">Pedido de oração</li>
                  <li className="text-gray-400 hover:text-white transition-colors text-lg">CET - Nova Vida</li>
                  <li className="text-gray-400 hover:text-white transition-colors text-lg">IBNV Music</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-4">
              {formData['footer.cells.title'] || 'Células'}
            </h3>
            <ul className="space-y-2">
              {formData['footer.cells.links']?.split(',').map((link, index) => (
                <li key={index} className="text-gray-400 hover:text-white transition-colors text-lg">{link}</li>
              )) || (
                <>
                  <li className="text-gray-400 hover:text-white transition-colors text-lg">Estudo de Células</li>
                  <li className="text-gray-400 hover:text-white transition-colors text-lg">Encontre uma célula</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <a href={formData['footer.social-media.instagram']} className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-8 h-8" />
              </a>
              <a href={formData['footer.social-media.youtube']} className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-8 h-8" />
              </a>
            </div>
            <p className="text-gray-400 text-sm md:text-xl text-center">
              © 2025 {formData['footer.copyright.text'] || 'Todos os direitos reservados'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderPreviewContent = () => {
    switch (title) {
      case 'Carrossel da Página Inicial':
        return renderHomePreview();
      case 'Seção Bem-vindo':
        return (
          <div className="bg-black p-8 transform scale-90 origin-top rounded-lg">
            <div className="max-w-[800px] mx-auto text-center text-white">
              <h2 className="text-4xl font-bold mb-6">
                {formData['sections.home.context.bemVindo.title'] || 'Bem-vindo à Igreja Batista Nova Vida'}
              </h2>
              <p className="text-lg mb-8">
                {formData['sections.home.context.bemVindo.description'] || 'Seja bem-vindo à Igreja Batista Nova Vida! Aqui, você encontrará um ambiente acolhedor e inspirador.'}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  {
                    label: formData['sections.home.context.bemVindo.buttons.label'] || 'Agenda',
                    link: formData['sections.home.context.bemVindo.buttons.link'] || '/agenda'
                  },
                  {
                    label: formData['sections.home.context.bemVindo.buttons.label2'] || 'Trilho de Crescimento',
                    link: formData['sections.home.context.bemVindo.buttons.link2'] || '/trilho-crescimento'
                  },
                  {
                    label: formData['sections.home.context.bemVindo.buttons.label3'] || 'Redes',
                    link: formData['sections.home.context.bemVindo.buttons.link3'] || '/redes'
                  },
                  {
                    label: formData['sections.home.context.bemVindo.buttons.label4'] || 'CET Nova Vida',
                    link: formData['sections.home.context.bemVindo.buttons.link4'] || '/downloads'
                  }
                ].map((button, index) => (
                  <button
                    key={index}
                    className="inline-block bg-secondary text-white px-8 py-3 rounded-full font-medium
                             hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Seção Nossa Igreja':
        return (
          <div className="space-y-8">
            {/* Preview Nossa Igreja */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Preview Nossa Igreja</h3>
              <div className="relative aspect-[21/9] bg-black rounded-lg overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative z-10 flex flex-col justify-center p-6 lg:p-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                      {formData['sections.our-church.title'] || 'Nossa Igreja'}
                    </h2>
                    <p className="text-base lg:text-lg text-gray-300 leading-relaxed line-clamp-3">
                      {formData['sections.our-church.description'] || 'Na Igreja Batista Nova Vida, acreditamos no poder transformador do amor de Deus. Venha fazer parte desta família e crescer espiritualmente conosco.'}
                    </p>
                  </div>
                  <div className="relative h-full">
                    <img
                      src={formData['sections.our-church.image'] || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3'}
                      alt="Imagem da Igreja"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Generosidade */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Preview Generosidade</h3>
              <div className="relative aspect-[21/9] bg-white rounded-lg overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative z-10 flex flex-col justify-center p-6 lg:p-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-black mb-3">
                      {formData['sections.generosity.title'] || 'Generosidade'}
                    </h2>
                    <p className="text-base lg:text-lg text-gray-900 leading-relaxed line-clamp-3">
                      {formData['sections.generosity.description'] || 'Sua generosidade através de dízimos e ofertas é fundamental para a expansão do Reino de Deus. Cada contribuição nos permite alcançar mais vidas e fortalecer nossa missão.'}
                    </p>
                    <button className="mt-4 px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/80 transition-colors w-fit">
                      {formData['sections.generosity.button'] || 'Contribua'}
                    </button>
                  </div>
                  <div className="relative h-full">
                    <img
                      src={formData['sections.generosity.image'] || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6'}
                      alt="Generosidade"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Seção de Transmissão':
        return renderTransmissionPreview();
      case 'Seção Generosidade':
        return renderGenerosityPreview();
      case 'Trilho de Crescimento':
        return renderGrowthTrackPreview();
      case 'Quem Somos':
        return renderAboutUsPreview();
      case 'Rodapé do Site':
        return renderFooterPreview();
      default:
        return null;
    }
  };

  const renderInputs = () => {
    if (title === 'Seção Nossa Igreja') {
      return (
        <div className="space-y-6">
          {/* Seção Nossa Igreja */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <p>Nossa Igreja</p>
            </div>

            {inputs.map((input) => (
              <div key={input.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {input.label}
                </label>
                {input.type === 'textarea' ? (
                  <textarea
                    value={formData[input.key] || ''}
                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
                  />
                ) : (
                  <input
                    type={input.type}
                    value={formData[input.key] || ''}
                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
                  />
                )}
              </div>
            ))}
          </div>
          {/* Seção Generosidade */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Heart className="w-5 h-5 text-gray-400" />
              </div>
              <p>Generosidade</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData['sections.generosity.title'] || ''}
                onChange={(e) => handleInputChange('sections.generosity.title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData['sections.generosity.description'] || ''}
                onChange={(e) => handleInputChange('sections.generosity.description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label do Botão
              </label>
              <input
                type="text"
                value={formData['sections.generosity.button'] || ''}
                onChange={(e) => handleInputChange('sections.generosity.button', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <input
                type="text"
                value={formData['sections.generosity.image'] || ''}
                onChange={(e) => handleInputChange('sections.generosity.image', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {inputs.map((input) => (
          <div key={input.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {input.label}
            </label>
            {input.type === 'textarea' ? (
              <textarea
                value={formData[input.key] || ''}
                onChange={(e) => handleInputChange(input.key, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            ) : (
              <input
                type={input.type}
                value={formData[input.key] || ''}
                onChange={(e) => handleInputChange(input.key, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900"
              />
            )}
          </div>
        ))}
      </div>
    );
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full mx-auto"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 space-y-6">
            {renderInputs()}
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
            <button
              type="submit"
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
              <span>Salvar e Continuar</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gray-50 rounded">
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Preview</h4>
            </div>
          </div>
          
          <div className="p-6">
            {renderPreviewContent()}
          </div>
        </div>
      </form>
    </motion.div>
  );
}
