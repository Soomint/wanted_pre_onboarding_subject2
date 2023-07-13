# wanted_pre_onboarding_subject2
## 원티드 프리온보딩 챌린지 7월 과제2

Next.js로 마크다운으로 작성한 블로그를 정적 페이지(SSG)로 작성해주세요.

### 마크다운 블로그 데이터 예시
---
categories:
  - Development
  - VIM
date: "2012-04-06"
description: 설명을 적는 곳입니다
slug: spf13-vim-3-0-release-and-new-website
tags:
  - .vimrc
  - plugins
  - spf13-vim
  - vim
title: hello
---

## 예시입니다
- 예시입니다

### 마크다운 attributes 파싱 예시
```javascript
{
  categories: [ 'Development', 'VIM' ],
  date: '2012-04-06',
  description: '설명을 적는 곳입니다',
  slug: 'spf13-vim-3-0-release-and-new-website',
  tags: [ '.vimrc', 'plugins', 'spf13-vim', 'vim' ],
  title: 'hello'
}
```

### 마크다운 본문 파싱 예시
```html
<h2>예시입니다</h2>
<ul>
    <li>예시입니다</li>
</ul> 
```

1. 필요한 페이지 : 블로그 리스트 페이지, 블로그 상세 페이지
SSG로 구현해야 하기 때문에, 상세 페이지 관련하여 [id].tsx파일을 생성하였습니다. (데이터에 따른 동적 페이지 생성)
블로그 리스트 페이지는 index.tsx에 구형하였습니다.

2. index.tsx
getStaticProps로 화면 렌더링에 필요한 데이터를 먼저 조회한 후, props에 해당 데이터를 세팅합니다.
```javascript
export const getStaticProps: GetStaticProps = async () => {
  const dir = process.cwd().concat('/__posts'); // 마크다운 블로그 데이터가 존재하는 디렉토리 참조

  const files: string[] = await fs.readdirSync(dir); // files객체에 마크다운 블로그 데이터 세팅

  const blogList = files.map((fileName: string) => {
    const id = fileName.replace(/\.md$/, ''); // 파일이름명 세팅

    const file = fs.readFileSync(process.cwd().concat(`/__posts/${id}.md`), 'utf-8'); // 해당파일 파일객체 선언

    const contents = fm(file).attributes; // front-matter 라이브러리로 마크다운 메타데이터 파싱

    return {
      id,
      ...contents,
    }
  });

  return {
    props: {
      blogList,
    },
  };
};
```

3. [id].tsx
getStaticPath로 블로그 글 수만큼 상세페이지가 필요하므로, 블로그 전체 글 개수 조회 후, 각 페이지마다 필요한 키값을 params에 세팅합니다.
getStaticProps로 해당 블로그 상세화면 렌더링에 필요한 데이터를 먼저 조회한 후, props에 해당 데이터를 세팅합니다.
```javascript
export const getStaticPaths: GetStaticPaths = async () => {
    const dir = process.cwd().concat('/__posts'); // 마크다운 블로그 데이터가 존재하는 디렉토리 참조

    const files: string[] = await fs.readdirSync(dir); // files객체에 마크다운 블로그 데이터 세팅

    const paths = files.map((fileName: string) => {
        const fileNameNoExt = fileName.replace(/\.md$/, ''); // 파일이름명 세팅

        return { params: { id: fileNameNoExt } } // params 세팅
    });

    return { paths, fallback: false };
};
```
```javascript
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { id } = params as any; // params로 넘어온 id

    const data = await fs.readFileSync(process.cwd().concat(`/__posts/${id}.md`), 'utf-8'); // file객체에 마크다운 블로그 상세글 데이터 세팅

    const parseResult = fm(data); // front-matter 라이브러리로 마크다운 메타데이터 파싱
    const blog = parseResult.attributes; // 블로그 상세글 메타데이터
    const contentsHtml = unified()
        .use(markdown)
        .use(remark2rehype)
        .use(html)
        .processSync(parseResult.body.toString()).value; // 블로그 상세글 본문 html 파싱

    return {
        props: {
            blog,
            contentsHtml,
        },
    };
};
```



