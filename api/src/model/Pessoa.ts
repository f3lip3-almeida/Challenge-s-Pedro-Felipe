import { clearScreenDown } from "readline";
import { DatabaseModel } from "./DatabaseModel";
import { log } from "console";

const database = new DatabaseModel().pool;

export class Pessoa {

    // atributos da classe
    private id: number = 0;
    private nome: string;
    private cpf: string;
    private dataNascimento: Date;
    private telefone: string;
    private endereco: string;
    private altura: number;
    private peso: number;

    //método construtor
    public constructor (_nome: string, _cpf: string, _data_nascimento: Date, _telefone: string, _endereco: string, _altura: number, _peso: number) {
            this.nome = _nome;
            this.cpf = _cpf;
            this.dataNascimento = _data_nascimento;
            this.telefone = _telefone;
            this.endereco = _endereco;
            this.altura = _altura;
            this.peso = _peso;
    }

    // métodos GETTERS and SETTERS
    
    public getId() {
        return this.id;
    }

    public setId(_id: number) {
        this.id = _id;
    }

    /**
     * Retorna o nome da pessoa
     * 
     * @returns nome : nome da pessoa
     */
    public getNome() {  
        return this.nome;
    }

    /**
     * Atribui o parâmetro ao atributo nome
     * 
     * @param _nome : nome da pessoa
     */
    public setNome(_nome: string){  
        this.nome = _nome;
    }

    /**
     * Retorna o CPF da pessoa
     * 
     * @returns cpf : cpf da pessoa 
     */
    public getCPF() {
        return this.cpf;
    }

    public setCPF(_cpf: string) {
        this.cpf = _cpf;
    }

    public getDataNascimento() {
        return this.dataNascimento;
    }

    public setDataNascimento(_data_nascimento: Date) {
        this.dataNascimento = _data_nascimento;
    }

    public getTelefone() {
        return this.telefone;
    }

    public setTelefone(_telefone: string) {
        this.telefone = _telefone;
    }

    public getEndereco() {
        return this.endereco;
    }

    public setEndereco(_endereco: string) {
        this.endereco = _endereco;
    }

    public getAltura() {
        return this.altura;
    }

    public setAltura(_altura: number) {
        this.altura = _altura;
    }

    public getPeso() {
        return this.peso;
    }

    /**
     * Atribui peso a pessoa
     * 
     * @param _peso
     *  peso da pessoa 
     */
    public setPeso(_peso: number) {
        this.peso = _peso;
    }

    static async listarPessoas(): Promise<Array<Pessoa> | null> {
        const listaPessoas: Array<Pessoa> = [];
        const querySelectPessoas = `SELECT * FROM pessoas ORDER BY nome ASC`;

        try {
            const queryReturn = await database.query(querySelectPessoas);

            queryReturn.rows.forEach((linha) => {
                const pessoa = new Pessoa(
                    linha.nome,
                    linha.cpf,
                    new Date(linha.data_nascimento),
                    linha.telefone,
                    linha.endereco,
                    parseInt(linha.altura),
                    parseInt(linha.peso)
                );
                pessoa.setId(linha.id);

                listaPessoas.push(pessoa);
            });

            return listaPessoas;
        } catch (error) {
            console.error(`Erro no modelo: ${error}`);
            return null;
        }
    }

    static async atualizarCadastroPessoa(pessoa: Pessoa): Promise<Boolean> {      
        let queryResult = false;
        try {
            const queryUpdatePessoa = `UPDATE pessoas
                                            SET nome = '${pessoa.nome.toUpperCase()}', 
                                            cpf = '${pessoa.cpf}', 
                                            data_nascimento = '${pessoa.dataNascimento.getFullYear()}-${pessoa.dataNascimento.getMonth() + 1}-${pessoa.dataNascimento.getDate() + 1}', 
                                            telefone = '${pessoa.telefone}', 
                                            endereco = '${pessoa.endereco.toUpperCase()}', 
                                            altura = ${pessoa.altura}, 
                                            peso = ${pessoa.peso}
                                        WHERE id = ${pessoa.id}`;
            
            await database.query(queryUpdatePessoa)
            .then((result) => {
                if(result.rowCount != 0) {
                    queryResult = true;
                }
            });

            return queryResult;
        } catch (error) {
            console.error(`Erro ao atualizar pessoa: ${error}`);
            return queryResult;
        }
    }
}