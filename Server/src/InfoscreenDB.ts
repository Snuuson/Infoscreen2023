import sqlite3, { Statement } from 'sqlite3';
import { open, Database, ISqlite } from 'sqlite';

class InfoscreenDB {
    HTML_Table_IDs = {
        PreviousSunday: 0,
        BusinessDays: 1,
        ComingSunday: 2,
    };
    filename = 'Infoscreen.db';
    constructor() {
        console.log('IN MODULE');
    }

    public async updateHeadLines(json_string: string) {
        try {
            let sql = `UPDATE Head_Lines SET json_data = '${json_string}' WHERE id = 0`;
            const db = await this.GetDB();
            await db.run(sql);
            db.close();
        } catch (error) {
            console.log(error);
        }
    }

    public async getHeadLinesAsJsonString(): Promise<string> {
        let res = '';
        try {
            let sql = `SELECT json_data from Head_Lines WHERE id = 0`;
            const db = await this.GetDB();
            res = await db.get(sql);
            db.close();
        } catch (error) {
            console.log(error);
        }
        return res;
    }

    public async updateHolidays(json_string: string) {
        try {
            let sql = `UPDATE Holidays SET json_data = '${json_string}' WHERE id = 0`;
            const db = await this.GetDB();
            await db.run(sql);
            db.close();
        } catch (error) {
            console.log(error);
        }
    }

    public async getHolidaysAsJsonString(): Promise<string> {
        let res = '';
        try {
            let sql = `SELECT json_data from Holidays WHERE id = 0`;
            const db = await this.GetDB();
            res = await db.get(sql);
            db.close();
        } catch (error) {
            console.log(error);
        }
        return res;
    }

    public async updateHTML_Table(id: number, json_string: string) {
        let sql = `UPDATE HTML_Tables SET json_data = '${json_string}' WHERE id =${id}`;
        const db = await this.GetDB();
        let res: ISqlite.RunResult<Statement> = await db.run(sql);
        db.close();
    }

    public async getHTML_Table(id: number): Promise<string> {
        let res = '';
        try {
            const sql = `SELECT json_data FROM HTML_Tables WHERE id =${id}`;
            const db = await this.GetDB();
            res = await db.get(sql);
            db.close();
        } catch (err) {
            console.log(err);
        }
        return res;
    }

    private async GetDB(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
        let db = await open({
            filename: this.filename,
            driver: sqlite3.Database,
        });
        return db;
    }
}

export default new InfoscreenDB();
