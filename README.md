### 1. **使用者角色與權限**

-   **一般訪客**：可以瀏覽作者所有公開的 Issue，包括作者名、發布時間、標題、內文、留言、表情等。
-   **作者**：除了擁有一般訪客的權限外，還可以發布新的 Issue、編輯或刪除自己的 Issue。

### 2. **主要頁面與功能**

-   **Home（/home）**：介紹作者和展示照片。
-   **Post（/post）**：顯示作者所有公開 Issue 的列表，支持根據不同標準進行排序。作者在此頁面可以發布新的 Issue。點擊具體Issue會進入到詳細頁面（/post/detail），展示 Issue 的內容、留言、表情等。作者本人在此頁面可以進行編輯或刪除操作。
-   **Login**：進行 GitHub OAuth 驗證，登入後 Navbar 會變為 Profile 和 Logout。
    -   **Profile（/profile）**：顯示使用者的 GitHub 頭貼和帳戶名稱，作者本人還可以查看自己的統計數據。
    -   **Logout**：登出功能，允許使用者退出登錄。

![image](/public//site.png)

### 3. **技術實現**

-   使用**GitHub API**進行數據的讀取和寫入，實現 Issue 的展示、新增、編輯、刪除等功能。
-   **GitHub OAuth**實現身份驗證，保護使用者數據和操作的安全。
-   使用 **TypeScript**、**Next.js** + **App Router**、**TailwindCSS** 進行開發。
