import { DateTime } from "luxon";
import React, { useEffect } from "react";
import { Col, Row } from "reactstrap";
import { useStore } from "simstate";
import styled, { keyframes } from "styled-components";

import ArticlePageBanner from "@/components/Article/ArticlePageBanner";
import CommentPanel from "@/components/Article/CommentPanel";
import ArticleContentDisplay from "@/components/Article/ContentDisplay";
import RelatedArticles from "@/components/Article/RelatedArticles";
import TocPanel from "@/components/Article/TocPanel";
import { PageMetadata } from "@/components/PageMetadata";
import { languageInfo, useI18n } from "@/i18n";
import BannerLayout from "@/layouts/BannerLayout";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import Page from "@/layouts/Page";
import { ArticleNode, Heading } from "@/models/ArticleNode";
import { HtmlAst } from "@/models/HtmlAst";
import ArticleStore from "@/stores/ArticleStore";
import MetadataStore from "@/stores/MetadataStore";
import { heights } from "@/styles/variables";
import { fromArticleTime } from "@/utils/datetime";
import useConstant from "@/utils/useConstant";

interface Props {
  pageContext: {
    id: string;
    lang: string;
    htmlAst: HtmlAst;
    headings: Heading[];
  };
  location: Location;
}


const enterAnimation = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const PageWithHeader = styled(Page)`
   animation: ${enterAnimation} 0.2s ease-in-out;
`;

const PageComponent: React.FC<{ hasHeader: boolean; children: React.ReactNode }> =
({ hasHeader, children }) => {
  return (
    hasHeader
      ? <PageWithHeader>{children}</PageWithHeader>
      : <Page>{children}</Page>
  );
};

interface RootLayoutProps {
  article: ArticleNode;
  lang: string;
  date: DateTime;
  lastUpdated?: DateTime;
}

const RootLayout: React.FC<React.PropsWithChildren<RootLayoutProps>> = ({
  article, children,
  lang, date, lastUpdated,
}) => {

  const {
    frontmatter: { id, title, tags, hide_heading },
    timeToRead, wordCountChinese,
  } = article;

  if (hide_heading) {
    return (
      <HeaderFooterLayout transparentHeader={false}>
        {children}
      </HeaderFooterLayout>
    );
  } else {
    return (
      <BannerLayout transparentHeader={false} banner={
        <ArticlePageBanner
          title={title}
          id={id}
          tags={tags}
          date={date}
          lastUpdated={lastUpdated}
          timeToRead={timeToRead}
          currentArticleLanguage={lang}
          wordCount={wordCountChinese}
        />
      }
      >
        {children}
      </BannerLayout>
    );
  }
};

const ArticlePageTemplate: React.FC<Props> = (props) => {

  const i18n = useI18n();
  const metadataStore = useStore(MetadataStore);
  const articleStore = useStore(ArticleStore);

  const { id, lang, htmlAst, headings } = props.pageContext;

  const articleNode = metadataStore.getArticleOfLang(id, lang);

  useEffect(() => {
    articleStore.setArticle(articleNode);
    return () => {
      articleStore.setArticle(null);
    };
  }, [articleNode]);

  const {
    path, excerpt,
    frontmatter: { title, date, tags, hide_heading, no_toc, related, last_updated },
  } = articleNode;

  const langPathMap = metadataStore.getLangPathMap(props.pageContext.id);

  const publishedTime = useConstant(() => fromArticleTime(date));
  const lastUpdatedTime = useConstant(() => last_updated
    ? fromArticleTime(last_updated)
    : undefined);

  return (
    <RootLayout
      article={articleNode} lang={lang}
      date={publishedTime} lastUpdated={lastUpdatedTime}
    >
      <div>
        <PageMetadata
          title={title}
          description={excerpt}
          url={path}
          locale={languageInfo[lang].detailedId}
          meta={[
            { name: "og:type", content: "article" },
            { name: "og:article:published_time", content: publishedTime.toISO() },
            ...(tags || []).map((x) => ({
              name: "og:article:tag",
              content: x,
            })),
            ...Object.keys(langPathMap)
              .filter((x) => x !== lang)
              .map((x) => ({
                name: "og:locale:alternate",
                content: languageInfo[x].detailedId,
              })),
          ]}
        />
        <PageComponent hasHeader={!hide_heading}>
          <Row>
            <Col md={no_toc ? 12 : 9} sm={12}>
              <ArticleContentDisplay
                htmlAst={htmlAst}
                headings={headings}
              />
            </Col>
            {
              !no_toc
              && (
                <Col md={3} className="d-none d-md-block">
                  <StickySidePanel>
                    <TocPanel headings={headings} />
                  </StickySidePanel>
                </Col>
              )
            }
          </Row>

          {/* <Share articleId={id} /> */}
          {related ? <RelatedArticles ids={related} /> : null}
          <hr />
          <CommentPanel
            language={languageInfo[i18n.currentLanguage.id].gitalkLangId}
            articleId={id}
            articleTitle={title}
          />
        </PageComponent>
      </div>
    </RootLayout>
  );
};

export default ArticlePageTemplate;

const StickySidePanel = styled.div`
  position: sticky;
  top: ${heights.header + 32}px;
`;
