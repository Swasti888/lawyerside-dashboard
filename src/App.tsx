import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import TemplateLibrary from './pages/TemplateLibrary'
import NegotiatedDocuments from './pages/NegotiatedDocuments'
import LegalQueries from './pages/LegalQueries'
import MyLegalCounsel from './pages/MyLegalCounsel'
import ClientAlerts from './pages/ClientAlerts'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<TemplateLibrary />} />
        <Route path="/documents" element={<NegotiatedDocuments />} />
        <Route path="/queries" element={<LegalQueries />} />
        <Route path="/counsel" element={<MyLegalCounsel />} />
        <Route path="/alerts" element={<ClientAlerts />} />
      </Routes>
    </Layout>
  )
}

export default App
