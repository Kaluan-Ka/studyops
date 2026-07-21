import styles from "./page.module.css";

const fundamentos = [
  {
    nome: "Hash Table",
    status: "Primeiro fundamento",
    progresso: "0%",
    proximoPasso: "Implementar hashmap minimo e comparar busca linear vs indexada.",
  },
  {
    nome: "Cache",
    status: "Em preparo",
    progresso: "0%",
    proximoPasso: "Conectar politica de cache ao Mini Redis aplicado a IA.",
  },
  {
    nome: "Busca textual",
    status: "Em preparo",
    progresso: "0%",
    proximoPasso: "Preparar demo de indice textual para o Local Research Searcher.",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <strong>StudyOps</strong>
        <nav aria-label="Navegacao principal">
          <a href="#fundamentos">Fundamentos</a>
          <a href="#tarefas">Tarefas</a>
          <a href="#evidencias">Evidencias</a>
        </nav>
      </header>
      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="titulo">
          <p className={styles.eyebrow}>MVP centrado em fundamentos</p>
          <h1 id="titulo">Trilha de engenharia de IA com progresso rastreavel.</h1>
          <p>
            Organize fundamentos, tarefas praticas, projetos de portfolio e evidencias
            produzidas em cada ciclo de estudo.
          </p>
        </section>

        <section id="fundamentos" className={styles.section} aria-labelledby="fundamentos-titulo">
          <div className={styles.sectionHeader}>
            <h2 id="fundamentos-titulo">Fundamentos</h2>
            <span>Conteudo versionado</span>
          </div>
          <div className={styles.track}>
            {fundamentos.map((fundamento, index) => (
              <article className={styles.fundamento} key={fundamento.nome}>
                <div className={styles.marker}>{index + 1}</div>
                <div>
                  <p>{fundamento.status}</p>
                  <h3>{fundamento.nome}</h3>
                  <span>Progresso {fundamento.progresso}</span>
                </div>
                <p>{fundamento.proximoPasso}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="tarefas" className={styles.summaryGrid} aria-label="Resumo operacional">
          <div>
            <span>Tarefas</span>
            <strong>1</strong>
            <p>Primeira tarefa curada para validar o fluxo de conteudo.</p>
          </div>
          <div>
            <span>Projetos</span>
            <strong>0</strong>
            <p>Projetos entram depois da base de fundamentos e tarefas.</p>
          </div>
          <div id="evidencias">
            <span>Evidencias</span>
            <strong>0</strong>
            <p>Notas, commits e benchmarks serao vinculados ao progresso.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
