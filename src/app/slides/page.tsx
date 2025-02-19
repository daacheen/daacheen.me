import { Metadata } from "next";
import { FaGithub } from "react-icons/fa";
import { fetchSlides } from "src/app/slides/api";
import { Heading } from "src/components/Heading";
import { Localized } from "src/i18n";
import { groupBy } from "src/utils/groupBy";
import { generateTitle } from "src/utils/metadata";

export const metadata: Metadata = {
  title: generateTitle("Slides"),
};

const SlidesDirectory = async () => {
  const slides = await fetchSlides();

  const map = groupBy(slides.map(({ name, html_url }) => ({
    year: name.substring(0, 4),
    date: `${name.substring(0, 4)}/${name.substring(4, 6)}/${name.substring(6, 8)}`,
    name: name.substring(9),
    githubUrl: html_url,
  })), (data) => data.year);

  // to sorted array
  const data = Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="border-l-4 border-l-neutral animate-slide-up">
      {
        data.map(([year, pres]) => {
          return (
            <div key={year} className="pb-5">
              <h2 className="text-2xl font-bold pb-2 border-l-4 border-l-accent px-3 -translate-x-1">
                {year}
              </h2>
              <div>
                {pres.sort((a, b) => b.date.localeCompare(a.date)).map((pre) => (
                  <div key={pre.date} className="py-1 px-2">
                    <a className="link link-hover text-lg" href={pre.githubUrl ?? undefined} target="__blank">
                      {pre.name}
                    </a>
                    <div className="text-sm">
                      {pre.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default function SlidesPage() {
  return (
    <div>
      <Heading>
        <h1 className="text-4xl py-2">
          <Localized id="resources.slides.title" />
        </h1>
        <p>
          <Localized id="resources.slides.description" />
        </p>
      </Heading>
      <div className="max-w-7xl mx-auto flex flex-wrap p-4 justify-center animate-slide-up">
        <div>
          <div>
            <p className="flex flex-wrap">
              <Localized
                id="resources.slides.autoGenerated"
                args={[
                  <a
                    key="link"
                    target="_blank"
                    className="flex items-center link link-hover px-1"
                    href="https://github.com/ddadaal/Slides"
                    rel="noreferrer"
                  >
                    <FaGithub />
                    <span>ddadaal/Slides</span>
                  </a>,
                ]}
              />
            </p>
          </div>
          <div className="py-4">
            <SlidesDirectory />
          </div>
        </div>
      </div>
    </div>
  );
}
