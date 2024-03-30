# IssueBlog

![image](/public/root.png)
這個網站是一個以　GitHub Issues　為基礎的個人部落格系統，特別設計來展示和管理個人的 Issues。透過 GitHub OAuth 進行身份驗證，允許一般訪客和作者訪問和互動網站。並利用 GitHub API 實現了文章的管理功能，包括發布、編輯和刪除文章。此外，網站採用現代的前端技術棧，包括 Next.js、TypeScript 和 TailwindCSS，以及多種開源 UI 組件庫，提供了一個響應式且用戶友好的界面。

為了更豐富的展現網站功能，如 UI/UX 設計、無限滾動、統計數據展示等，網站部署版本以 DINU ，來自 Dttofriends 的一個角色，作為虛擬的作者，並建立了一個對應的　GitHub　帳號。

網站連結：https://dinu-blog.vercel.app/

作者帳號：https://github.com/dinu1215

將這個專案 clone 到本地後，可以通過修改環境變數，將作者替換成任意的 GitHub 用戶。

## 網站說明

### 1. **使用者角色與權限**

-   **一般訪客**：可以瀏覽作者所有公開的 Issue，包括作者名、發布時間、標題、內文、留言、表情等。
-   **作者**：除了擁有一般訪客的權限外，還可以發布新的 Issue、編輯或刪除自己的 Issue。

### 2. **主要頁面**

![image](/public/site.png)

-   **Home（/home）**：介紹作者和展示照片。
    ![image](/public/home.png)
-   **Post（/post）**：顯示作者所有公開 Issue 的列表，支持根據不同標準進行排序。作者在此頁面可以發布新的 Issue。點擊具體Issue會進入到詳細頁面（/post/detail），展示 Issue 的內容、留言、表情等。作者本人在此頁面可以進行編輯或刪除操作。
    ![image](/public/post.png)
-   **Login**：進行 GitHub OAuth 驗證，登入後 Navbar 會變為 Profile 和 Logout。
    -   **Profile（/profile）**：顯示使用者的 GitHub 頭貼和帳戶名稱，作者本人可以查看自己的統計數據。
        ![image](/public/profile.png)
    -   **Logout**：登出功能。

### 3. **功能完成說明**

#### 基本功能

-   [x] GitHub Login
-   [x] Post Management
-   [x] User Interface

#### 加分功能

-   [x] 使⽤ TypeScript
-   [x] Next.js + App Router
-   [x] 調校 Web Vitals 評分：使用 PageSpeed Insights
        ![image](/public/analysis.png)
-   [x] 處理錯誤及例外狀況 (Error Handling)
        ![image](/public/errorHandling.png)
-   [x] 部署⾄線上環境：使用 Vercel ，網站連結：https://dinu-blog.vercel.app/

#### 額外功能

-   [x] 作者可於 Profile 介面查看自己 Issue 的統計數據，包含 Issues 總數、獲得的 Reactions 和 Comments 總數
        ![image](/public/profile.png)
-   [x] 支援 RWD
        ![image](/public/rwd.png)
-   [x] 作者編輯 Issue 時可以預覽解析後的 Markdown 文本
-   [x] 可看到 Issue 和 Comment 獲得的 Reaction
-   [x] 可將 Issues 根據發文時間、更新時間、Reactions 總數、Comments 總數進行排序

### 4. **技術實現**

-   Frontend framework: Next.js
-   Backend: GitHub API
-   Authentication: GitHub OAuth
-   Deployment: Vercel
-   Package manager: Yarn
-   Language: TypeScript
-   CSS framework: TailwindCSS
-   Component library:　Shadcn、Headless、Radix
-   Code formatting: ESLint, Prettier

## 本地安裝方式

### 環境變數

#### 1.

```
cp .env.example .env
```

#### 2.

在 .env 中填入以下環境變數：

-   **GITHUB_CLIENT_ID**：填入從 GitHub 註冊 OAuth APP 獲得的 Client ID。用於識別應用程式。
-   **GITHUB_CLIENT_SECRET**：填入從 GitHub 註冊 OAuth APP 獲得的 Client secret。這是一串安全的 Key，用於在應用程式和 GitHub 之間進行安全通訊。
-   **AUTHOR_GITHUB_PAT**：填入作者的 GitHub Personal Access Token。用於賦予應用程式訪問 GitHub 資源的權限。
-   **AUTHOR_GITHUB_USER_ID**：填入作者的 GitHub User ID。
-   **NEXT_PUBLIC_AUTHOR_GITHUB_USERNAME**：填入作者的 GitHub Username。
-   **NEXTAUTH_SECRET**：填入一串安全的隨機字符，用於 NextAuth.js 進行安全簽名和加密。

### 安裝套件

```bash
yarn
```

### 執行網頁

#### 1.

```bash
yarn build
yarn start
```

#### 2. 在瀏覽器訪問 http://localhost:3000

## 網站圖片來源

Dttofriends Instagram 粉專 https://www.instagram.com/dttofriends/

Dttofriends 官方網站 https://store.dttofriends.com/
