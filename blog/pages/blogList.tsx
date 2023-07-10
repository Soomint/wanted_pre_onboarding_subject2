import { GetStaticPaths } from "next/types";

const fs = require('fs');

export const getStaticPaths: GetStaticPaths = async () => {
    const dir = '../__posts';

    const fileNameArray: string[] = [];

    await fs.readdir(dir, (err: any, files: File) => {
        fileNameArray.push(files.name.split('.')[0]);
    });

    const paths = fileNameArray.map((fileName: string) => (
        { params: { id: fileName } }
    ));

    return { paths, fallback: false };
};