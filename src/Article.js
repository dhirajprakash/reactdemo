import React, {Component} from 'react';
import {Button} from 'reactstrap';
import uuid from 'uuid';
import Helper from './Helper';

class Article extends Component {

    addArticle() {
        const articleObj = {
            id: uuid.v4(),
            articleType: Helper.replaceEmptyValue(this.refs.articleType.value),
            articleSubType: Helper.replaceEmptyValue(this.refs.articleSubType.value),
            articleQuantity: Helper.replaceEmptyValue(this.refs.articleQuantity.value),
            articleQtyUnit: Helper.replaceEmptyValue(this.refs.articleQtyUnit.value),
            articleMake: Helper.replaceEmptyValue(this.refs.articleMake.value),
            articleActionType: Helper.replaceEmptyValue(this.refs.articleActionType.value)
        };

        this.props.addArticle(articleObj);
    }

    deleteArticle(id) {
        this.props.deleteArticle(id);
    }

    render() {

        let articlesData = [];
        if(this.props.articles) {
            articlesData = this.props.articles.map(p =>
                <tr key={p.id}>
                    <td>
                        {p.articleType}
                    </td>
                    <td>
                        {p.articleSubType}
                    </td>
                    <td>
                        {p.articleQuantity}&nbsp;{p.articleQtyUnit}
                    </td>
                    <td>
                        {p.articleMake}
                    </td>
                    <td>
                        {p.articleActionType}
                    </td>
                    <td>
                        <Button color="danger" size="sm" outline
                                onClick={this.deleteArticle.bind(this, p.id)}>-</Button>
                    </td>
                </tr>
            );
        }
        return (
            <div className="bg-change-on-hover">
                <table className="mt-2">
                    <tbody>
                    <tr>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Tipo</label>
                                <input className="form-control" ref="articleType"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Subtipo</label>
                                <input className="form-control" ref="articleSubType"/>
                            </div>
                        </td>
                        <td width="10%">
                            <div className="input-group-sm ml-1">
                                <label>Qtde</label>
                                <input type="number" className="form-control" ref="articleQuantity"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Unidade</label>
                                <select className="form-control" ref="articleQtyUnit">
                                    <option value="Unidade">Unidade</option>
                                    <option value="Qilo">Qilo</option>
                                    <option value="Grama">Grama</option>
                                    <option value="Valor">Valor</option>
                                </select>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Marca</label>
                                <input className="form-control" ref="articleMake"/>
                            </div>
                        </td>
                        <td width="15%" className="align-bottom">
                            <div className="input-group-sm ml-1">
                            <select className="form-control" ref="articleActionType">
                                <option value="Apreendido">Apreendido</option>
                                <option value="Subtraido">Subtraido</option>
                            </select>
                            </div>
                        </td>
                        <td className="align-bottom">
                            <div className="ml-1 float-right">
                                <Button color="success" size="sm" outline className="mb-1 mt-1"
                                        onClick={this.addArticle.bind(this)}>+</Button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="mt-3 mb-2" style={{
                    display: this.props.articles && this.props.articles.length > 0 ? '' : 'none',
                    maxHeight: 200,
                    overflowX: 'auto'
                }}>
                    <table className="table table-hover table-bordered">
                        <tbody>
                        <tr className="card-header-tabs bg-secondary">
                            <th>Tipo</th>
                            <th>Subtipo</th>
                            <th>QTDE Unidade</th>
                            <th>Marca</th>
                            <th>&nbsp;</th>
                            <th>&nbsp;</th>
                        </tr>
                        {articlesData}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

export default Article;