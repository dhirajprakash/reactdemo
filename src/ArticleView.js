import React, {Component} from 'react';
import {Button} from 'reactstrap';
import uuid from 'uuid';
import Helper from './Helper';

class ArticleView extends Component {
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
                </tr>
            );
        }
        return (
            <div className="bg-change-on-hover">
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
                        </tr>
                        {articlesData}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

export default ArticleView;