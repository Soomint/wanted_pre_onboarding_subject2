import { GetStaticProps } from "next/types";

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

const blog = (blog: BLOG) => {
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
                <td colSpan={4} dangerouslySetInnerHTML={{ __html: blog.contents }}>
                </td>
            </tr>
        </table>
    );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { id } = params as any;

    const data = fs.readFile(`../__posts/${id}.md`, 'utf8');

    const contents = fm(data);

    return {
        props: {
            blog,
            contents,
        },
    };
};

export default blog;