'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  Shield,
  Lock,
  Eye,
  FileText,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';

const sections = [
  {
    id: 'introducao',
    title: '1. Introdução',
    icon: Shield,
    content: [
      'A Up Ai ("nós", "nosso" ou "empresa") respeita sua privacidade e está comprometida em proteger seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações quando você usa nossa plataforma de transcrição de áudio com inteligência artificial.',
      'Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e outras leis aplicáveis de proteção de dados brasileiras.'
    ]
  },
  {
    id: 'dados-coletados',
    title: '2. Dados Coletados',
    icon: Eye,
    content: [
      'Coletamos os seguintes tipos de dados pessoais:',
      '• Dados de identificação: nome, e-mail, empresa (opcional)',
      '• Dados de conta: nome de usuário, senha (criptografada), preferências e configurações',
      '• Dados de uso: histórico de transcrições, arquivos de áudio enviados, tempo de uso da plataforma, funcionalidades utilizadas',
      '• Dados técnicos: endereço IP, tipo de navegador, sistema operacional, páginas visitadas, data e hora de acesso',
      '• Dados de pagamento: informações de cartão de crédito processadas através de provedores seguros de pagamento terceirizados (não armazenamos dados completos de cartão de crédito)'
    ]
  },
  {
    id: 'como-utilizamos',
    title: '3. Como Utilizamos Seus Dados',
    icon: FileText,
    content: [
      'Utilizamos seus dados pessoais para as seguintes finalidades:',
      '• Fornecer e melhorar nossos serviços de transcrição',
      '• Processar transações e gerenciar sua assinatura',
      '• Enviar notificações importantes sobre sua conta e nossos serviços',
      '• Fornecer suporte ao cliente e responder a suas solicitações',
      '• Personalizar sua experiência na plataforma',
      '• Enviar comunicações de marketing (com seu consentimento)',
      '• Analisar o uso da plataforma para melhorar nossos serviços',
      '• Detectar, prevenir e resolver problemas técnicos e de segurança'
    ]
  },
  {
    id: 'base-legal',
    title: '4. Base Legal',
    icon: CheckCircle,
    content: [
      'Processamos seus dados pessoais com base nas seguintes bases legais:',
      '• Execução de contrato: para fornecer os serviços que você solicitou',
      '• Consentimento: quando você nos dá permissão explícita para processar seus dados',
      '• Legítimo interesse: para melhorar nossos serviços, segurança e experiência do usuário',
      '• Cumprimento de obrigações legais: para cumprir com as leis e regulamentos aplicáveis'
    ]
  },
  {
    id: 'compartilhamento',
    title: '5. Compartilhamento de Dados',
    icon: UserCheck,
    content: [
      'Não vendemos seus dados pessoais a terceiros. Podemos compartilhar seus dados apenas nas seguintes situações:',
      '• Provedores de serviços: com empresas que nos ajudam a operar nossa plataforma (hospedagem, processamento de pagamentos, análise de dados) sob contratos de confidencialidade',
      '• Cumprimento legal: quando exigido por lei, ordem judicial ou autoridades governamentais',
      '• Transferências de negócios: em caso de fusão, aquisição ou venda de ativos',
      '• Com seu consentimento: quando você autoriza explicitamente o compartilhamento'
    ]
  },
  {
    id: 'seguranca',
    title: '6. Segurança dos Dados',
    icon: Lock,
    content: [
      'Implementamos medidas técnicas e organizacionais robustas para proteger seus dados:',
      '• Criptografia SSL/TLS para transmissão de dados',
      '• Criptografia em repouso para dados armazenados',
      '• Controles de acesso restritos e autenticação multifator',
      '• Monitoramento contínuo de segurança e detecção de ameaças',
      '• Backups regulares e planos de recuperação de desastres',
      '• Treinamento de equipe sobre proteção de dados',
      'Apesar dessas medidas, nenhum sistema é 100% seguro. Você também é responsável por manter a confidencialidade de suas credenciais de login.'
    ]
  },
  {
    id: 'retencao',
    title: '7. Retenção de Dados',
    content: [
      'Retemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção maior seja exigido ou permitido por lei.',
      '• Dados de conta: enquanto sua conta estiver ativa e até 1 ano após inatividade',
      '• Dados de transação: conforme exigido por lei fiscal (geralmente 5 anos)',
      '• Dados de transcrição: enquanto sua conta estiver ativa e até 30 dias após o cancelamento (você pode solicitar exclusão imediata)',
      '• Logs de sistema: geralmente por 90 dias'
    ]
  },
  {
    id: 'seus-direitos',
    title: '8. Seus Direitos',
    content: [
      'Você tem os seguintes direitos em relação aos seus dados pessoais:',
      '• Acesso: solicitar uma cópia dos dados que possuímos sobre você',
      '• Correção: solicitar correção de dados incompletos ou imprecisos',
      '• Exclusão: solicitar a exclusão de seus dados em certas circunstâncias',
      '• Portabilidade: receber seus dados em formato estruturado e de uso comum',
      '• Revogação de consentimento: retirar seu consentimento a qualquer momento',
      '• Oposição: opor-se ao processamento de seus dados para certas finalidades',
      'Para exercer esses direitos, entre em contato conosco através do e-mail: privacidade@clarityaudio.com'
    ]
  },
  {
    id: 'cookies',
    title: '9. Cookies e Tecnologias Similares',
    content: [
      'Utilizamos cookies e tecnologias similares para melhorar sua experiência na plataforma. Para mais informações, consulte nossa Política de Cookies.',
      'Tipos de cookies que utilizamos:',
      '• Cookies essenciais: necessários para o funcionamento da plataforma',
      '• Cookies de análise: para entender como os usuários interagem com nossa plataforma',
      '• Cookies de funcionalidade: para lembrar suas preferências e configurações'
    ]
  },
  {
    id: 'menores',
    title: '10. Menores de Idade',
    content: [
      'Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente dados pessoais de menores. Se tomarmos conhecimento de que coletamos dados de um menor sem consentimento parental adequado, tomaremos medidas para excluir essas informações.'
    ]
  },
  {
    id: 'internacional',
    title: '11. Transferências Internacionais',
    content: [
      'Seus dados podem ser transferidos e armazenados em servidores localizados fora do Brasil. Garantimos que qualquer transferência internacional seja feita em conformidade com a LGPD e outras leis de proteção de dados aplicáveis, implementando salvaguardas apropriadas.'
    ]
  },
  {
    id: 'alteracoes',
    title: '12. Alterações nesta Política',
    content: [
      'Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou por outros motivos operacionais, legais ou regulatórios. Notificaremos você sobre quaisquer mudanças significativas através de e-mail ou aviso em nossa plataforma.',
      'Recomendamos que você revise esta política periodicamente.'
    ]
  },
  {
    id: 'contato',
    title: '13. Contato',
    content: [
      'Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao processamento de seus dados pessoais, entre em contato conosco:',
      '• E-mail: privacidade@clarityaudio.com',
      '• Endereço: Goiânia, GO - Brasil',
      '• Telefone: +55 (62) 99647-7432'
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <Layout showHeader={true} showFooter={true}>
      <Box sx={{ minHeight: '100vh' }}>
        <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)', color: 'white' }}>
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: '900px', mx: 'auto', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Shield size={40} color="white" />
                </Box>
              </Box>
              <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, mb: 3 }}>
                Política de Privacidade
              </Typography>
              <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '700px', mx: 'auto' }}>
                Transparência e confiança no tratamento dos seus dados pessoais
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Última atualização</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{new Date().toLocaleDateString('pt-BR')}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>|</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Versão 1.0</Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        <Box sx={{ py: 8, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
          <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4 }}>
              <Box sx={{ mb: 4, p: 3, backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Índice
                </Typography>
                <List dense>
                  {sections.map((section, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={
                          <Typography 
                            component="a" 
                            href={`#${section.id}`}
                            sx={{ 
                              color: 'primary.main', 
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            {section.title}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {sections.map((section, index) => (
                <Box key={index} id={section.id} sx={{ mb: 5 }}>
                  {index > 0 && <Divider sx={{ mb: 4 }} />}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    {section.icon && (
                      <section.icon size={28} color="#3b82f6" />
                    )}
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {section.title}
                    </Typography>
                  </Box>
                  {section.content.map((paragraph, pIndex) => (
                    <Typography 
                      key={pIndex} 
                      variant="body1" 
                      sx={{ 
                        mb: 2, 
                        color: 'text.secondary',
                        lineHeight: 1.8
                      }}
                    >
                      {paragraph}
                    </Typography>
                  ))}
                </Box>
              ))}

              <Divider sx={{ my: 4 }} />
              <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Ao usar nossa plataforma, você concorda com esta Política de Privacidade.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Se você tiver alguma dúvida, entre em contato conosco em{' '}
                  <Link 
                    href="mailto:privacidade@clarityaudio.com" 
                    style={{ color: '#3b82f6', textDecoration: 'none' }}
                  >
                    privacidade@clarityaudio.com
                  </Link>
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Typography
                component={Link}
                href="/terms"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Termos de Serviço
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>|</Typography>
              <Typography
                component={Link}
                href="/cookies"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Política de Cookies
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>|</Typography>
              <Typography
                component={Link}
                href="/contact"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Contato
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
}
