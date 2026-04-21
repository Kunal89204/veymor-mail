import { Injectable } from '@nestjs/common';
import { ConnectImapDto } from './dto/connect-imap.dto';
import { ImapFlow, MailboxObject } from 'imapflow';
import { SuccessResponse } from 'src/common/dto/response.dto';

@Injectable()
export class MailService {
  private safe(data: any) {
    return JSON.parse(
      JSON.stringify(data, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
  }

  private createClient(body: ConnectImapDto) {
    return new ImapFlow({
      host: body.host,
      port: body.port,
      secure: body.secure,
      auth: {
        user: body.email,
        pass: body.password,
      },
      logger: false,
    });
  }

  async connectImap(body: ConnectImapDto) {
    const client = this.createClient(body);

    try {
      await client.connect();
      await client.logout();

      return new SuccessResponse('Connection successful', {
        email: body.email,
        providerHost: body.host,
      });
    } catch (error: any) {
      return {
        success: false,
        message: error?.responseText || error?.message || 'Unknown error',
      };
    }
  }

  async getFolders(body: ConnectImapDto) {
    const client = this.createClient(body);

    try {
      await client.connect();

      const folders = await client.list();

      await client.logout();

      return new SuccessResponse(
        'Folders fetched',
        this.safe(
          folders.map((folder: any) => ({
            path: folder.path,
            name: folder.name,
            specialUse: folder.specialUse || null,
            listed: folder.listed,
            subscribed: folder.subscribed,
          })),
        ),
      );
    } catch (error: any) {
      return {
        success: false,
        message: error?.responseText || error?.message || 'Unknown error',
      };
    }
  }

  async getEmails(body: ConnectImapDto & {
    folder: string;
    page: number;
    limit: number;
  }) {
    const client = this.createClient(body);

    try {
      await client.connect();

      const lock = await client.getMailboxLock(body.folder);

      const total = Number((client.mailbox as MailboxObject)?.exists ?? 0);

      const page = Number(body.page || 1);
      const limit = Number(body.limit || 20);

      const end = total - (page - 1) * limit;
      const start = Math.max(1, end - limit + 1);

      const messages: any[] = [];

      if (end > 0) {
        for await (const msg of client.fetch(`${start}:${end}`, {
          uid: true,
          envelope: true,
          internalDate: true,
          flags: true,
        })) {
          messages.push({
            uid: String(msg.uid),
            subject: msg.envelope?.subject || '',
            from:
              msg.envelope?.from?.map((i) => ({
                name: i.name || '',
                email: i.address || '',
              })) || [],
            to:
              msg.envelope?.to?.map((i) => ({
                name: i.name || '',
                email: i.address || '',
              })) || [],
            date: msg.internalDate,
            flags: msg.flags ? Array.from(msg.flags) : [],
          });
        }
      }

      lock.release();
      await client.logout();

      return new SuccessResponse(
        'Emails fetched',
        this.safe({
          items: messages.reverse(),
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        }),
      );
    } catch (error: any) {
      return {
        success: false,
        message: error?.responseText || error?.message || 'Unknown error',
      };
    }
  }

  async getEmailDetail(body: ConnectImapDto & {
    folder: string;
    uid: string;
  }) {
    const client = this.createClient(body);

    try {
      await client.connect();

      const lock = await client.getMailboxLock(body.folder);

      let email: any = null;

      for await (const msg of client.fetch(body.uid, {
        uid: true,
        envelope: true,
        source: true,
      })) {
        email = {
          uid: String(msg.uid),
          subject: msg.envelope?.subject || '',
          source: msg.source?.toString() || '',
        };
      }

      lock.release();
      await client.logout();

      return new SuccessResponse(
        'Email detail fetched',
        this.safe(email),
      );
    } catch (error: any) {
      return {
        success: false,
        message: error?.responseText || error?.message || 'Unknown error',
      };
    }
  }
}