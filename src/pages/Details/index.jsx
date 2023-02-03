import { useState, useEffect } from 'react'
import { Container, Links, Content } from './styles.js'
import { useParams, useNavigate } from 'react-router-dom'

import { api } from '../../services/api'

import { Header } from '../../components/Header'
import { Button } from '../../components/Button'
import { Section } from '../../components/Section'
import { Tag } from '../../components/Tag'
import { ButtonText } from '../../components/ButtonText'

export function Details() {
  const [data, setData] = useState(null);

  const navigate = useNavigate()
  const params = useParams();

  function handleBack() {
    navigate(-1)
  }

  async function handleRemove(id) {
    const confirm = window.confirm("Deseja realmente excluir esta nota?");
    if (confirm) {
      await api.delete(`/notes/${id}`);
      navigate(-1);
    }
  }

  useEffect(() => {
    async function fetchNote() {
      const response = await api.get(`/notes/${params.id}`)

      setData(response.data)
      console.log(response.data.links);
    }

    fetchNote()
  }, []);

  return (
    <Container>
      <Header />

      {
        data &&
        <main>
          <Content>

            <ButtonText title="Excluir nota" onClick={() => handleRemove(data.id)} />

            <h1>{data.title}</h1>
            <p>
              {data.description}
            </p>

            {
              data.links &&
              <Section title="Links úteis">
                <Links>
                  {
                    data.links.map(link => (
                      link.url &&
                      <li key={String(link.id)}>
                        <a
                          href={link.url}
                          target="_blank"
                        >
                          {link.url}
                        </a>
                      </li>
                    ))
                  }
                </Links>
              </Section>
            }

            {
              data.tags &&
              <Section title="Marcadores">
                {
                  data.tags.map(tag => (
                    tag.name &&
                    <Tag
                      key={String(tag.id)}
                      title={tag.name} />
                  ))
                }
              </Section>
            }

            <Button title="Voltar" onClick={handleBack} />

          </Content>
        </main>
      }
    </Container>
  )
}
