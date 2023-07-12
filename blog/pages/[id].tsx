import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType, NextPage } from "next/types";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";

export interface BLOG {
    id: number;
    categories: string[];
    date: string;
    description: string;
    slug: string;
    tags: string[];
    title: string;
    contents: string;
}

const fs = require('fs');
const fm = require('front-matter');

const Blog: NextPage = ({ blog, contentsHtml }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <Head>
                <title>Blog</title>
                <meta name="description" content="Generated by create next app" />
            </Head>

            <main className={styles.main}>
                <h1 onClick={() => router.push('/')} style={{ cursor: 'pointer', marginBottom: '100px' }}>리스트로 이동</h1>
                <table>
                    <tr style={{ padding: '5px' }}>
                        <th>카테고리</th>
                        <th>제목</th>
                        <th>작성일자</th>
                        <th>태그</th>
                    </tr>
                    <tr style={{ padding: '5px' }}>
                        <td>{blog.categories.map((category: string, idx: number) => category.concat((idx + 1) === blog.categories.length ? '' : ', '))}</td>
                        <td>{blog.title}</td>
                        <td>{blog.date}</td>
                        <td>{blog.tags.map((tag: string, idx: number) => '#'.concat(tag).concat((idx + 1) === blog.tags.length ? '' : ' '))}</td>
                    </tr>
                    <tr style={{ padding: '5px' }}>
                        <td colSpan={4} dangerouslySetInnerHTML={{ __html: contentsHtml }}>
                        </td>
                    </tr>
                </table>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { id } = params as any;

    const data = await fs.readFileSync(process.cwd().concat(`/__posts/${id}.md`), 'utf-8');

    const parseResult = fm(data);
    const blog = parseResult.attributes;
    const contentsHtml = unified()
        .use(markdown)
        .use(remark2rehype)
        .use(html)
        .processSync(parseResult.body.toString()).value;

    return {
        props: {
            blog,
            contentsHtml,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const dir = process.cwd().concat('/__posts');

    const files: string[] = await fs.readdirSync(dir);

    const paths = files.map((fileName: string) => {
        const fileNameNoExt = fileName.replace(/\.md$/, '');

        return { params: { id: fileNameNoExt } }
    });

    return { paths, fallback: false };
};

export default Blog;