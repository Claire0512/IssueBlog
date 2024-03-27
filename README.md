# 2024 Frontend Intern Homework

## 網站說明

### 1. **使用者角色與權限**

-   **一般訪客**：可以瀏覽作者所有公開的 Issue，包括作者名、發布時間、標題、內文、留言、表情等。
-   **作者**：除了擁有一般訪客的權限外，還可以發布新的 Issue、編輯或刪除自己的 Issue。

### 2. **主要頁面與功能**

![image](/public/site.png)

-   **Home（/home）**：介紹作者和展示照片。
    ![image](/public/home.png)
-   **Post（/post）**：顯示作者所有公開 Issue 的列表，支持根據不同標準進行排序。作者在此頁面可以發布新的 Issue。點擊具體Issue會進入到詳細頁面（/post/detail），展示 Issue 的內容、留言、表情等。作者本人在此頁面可以進行編輯或刪除操作。

    ![image](/public/post.png)
    ![image](/public/new_post.png)
    ![image](/public/post_detail_1.png)
    ![image](/public/post_detail_2.png)

-   **Login**：進行 GitHub OAuth 驗證，登入後 Navbar 會變為 Profile 和 Logout。
    -   **Profile（/profile）**：顯示使用者的 GitHub 頭貼和帳戶名稱，作者本人還可以查看自己的統計數據。
        ![image](/public/profile.png)
    -   **Logout**：登出功能，允許使用者退出登錄。

### 3. **技術實現**

-   使用 **GitHub API** 進行數據的讀取和寫入，實現 Issue 的展示、新增、編輯、刪除等功能。
-   **GitHub OAuth** 實現身份驗證，保護使用者數據和操作的安全。
-   使用 **TypeScript**、**Next.js** + **App Router**、**TailwindCSS** 進行開發。

## 網站連結

## 本地安裝方式

### 環境變數

#### 1.

```
cp .env.example .env
```

#### 2.

在 .env 中填入環境變數。
**GITHUB_CLIENT_ID**：填入從 GitHub 註冊 OAuth APP 獲得的 Client ID。用於識別應用程式。
**GITHUB_CLIENT_SECRET**：填入從 GitHub 註冊 OAuth APP 獲得的 Client secret。這是一串安全的 Key，用於在應用程式和 GitHub 之間進行安全通訊。
**AUTHOR_GITHUB_PAT**：填入作者的 GitHub Personal Access Token。用於賦予應用程式訪問 GitHub 資源的權限。
**AUTHOR_GITHUB_USER_ID**：填入作者的 GitHub User ID。
**NEXT_PUBLIC_AUTHOR_GITHUB_USERNAME**：填入作者的 GitHub Username。
**NEXTAUTH_SECRET**：填入一串安全的隨機字符，用於 NextAuth.js 進行安全簽名和加密。
**NEXTAUTH_URL**：填入網站的完整 URL。

### 安裝套件

```bash
yarn
```

### 執行網頁

#### 1.

```bash
yarn dev
```

#### 2. 在瀏覽器訪問 `http://localhost:3000`
