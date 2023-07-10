import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next/types";

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

const blog = ({ blog, contentsHtml }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <table>
            <tr>
                <th>카테고리</th>
                <th>제목</th>
                <th>작성일자</th>
                <th>태그</th>
            </tr>
            <tr>
                <td>{blog.categories}</td>
                <td>{blog.title}</td>
                <td>{blog.date}</td>
                <td>{blog.tags}</td>
            </tr>
            <tr>
                <td colSpan={4} dangerouslySetInnerHTML={{ __html: contentsHtml }}>
                </td>
            </tr>
        </table>
    );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { id } = params as any;

    const data = await fs.readFileSync(process.cwd().concat(`/__posts/${id}.md`), 'utf-8');

    const parseResult = fm(data);
    const blog = parseResult.attributes;
    const contentsHtml = parseResult.body;

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

export default blog;