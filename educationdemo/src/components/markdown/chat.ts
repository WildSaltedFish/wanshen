/*
 * @Author: bc-ax 1542650614@qq.com
 * @Date: 2025-03-11 17:00:59
 * @LastEditors: bc-ax 1542650614@qq.com
 * @LastEditTime: 2025-03-11 17:01:09
 * @FilePath: \demo\src\components\markdown\chat.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    reasoning?: string;
    attachments?: Array<{
      type: string;
      url: string;
      name: string;
    }>;
    vote?: 'up' | 'down';
  }
  
  export interface Vote {
    messageId: string;
    type: 'up' | 'down';
  }