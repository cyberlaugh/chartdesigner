<!--
 * @Description: 数据驱动自由表格，数据可来源于设计器或直接自定义
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-16 09:49:50
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-19 16:02:25
 * @Tool: Auto Generated by koroFileHeader
-->
<script type="text/jsx">
import { loadTableData } from '../api/dataLoader'
import mixin from './mixin'

export default {
    name:'CvFreeTable',
    mixins:[mixin],
    data(){
        return {
            dataSource:null,
            containerStyle:null,
            tableData:null,
            template:null,
            headerText:null,
            footerText:null
        }
    },
    methods:{
        loadData(params){
            this.tableData = loadTableData(this.merge({},this.dataSource,params))
        },
        getValue(){
            return this
        },
        updateTitle(params){
            console.log('updateTitle',params)
            const keys = Object.keys(params)
            if(keys.length > 0){
                let headerText = this.template.header.text
                keys.forEach(k=>{
                    const regVariable = new RegExp("\\${" + k + "}",'g')
                    headerText = headerText.replace(regVariable, params[k])
                })
                this.headerText = headerText
            }
        }
    },
    created(){
        this.dataSource = {...this.cfg.dataSource}
        this.template = this.cloneDeep(this.cfg.template)
        this.headerText = this.template.header.text
        this.footerText = this.template.footer.text
        
        this.listen = this.cloneDeep(this.cfg.listen)        
        this.bindListenEvents(this.listen)
        
        if(!this.dataSource.lazyLoad){
            this.loadData(this.dataSource)
        }
    },
    render(){
        const grps = this.template.rowGroups.map(grp => {
            return grp.rows.map(row=>{
                return <tr style={row.style}> { 
                    row.cells.map(cell=>{
                        const attrsCell = {}
                        let styleCell = {}
                        if(cell.rowspan){
                            attrsCell.rowspan = cell.rowspan
                        }
                        if(cell.colspan){
                            attrsCell.colspan = cell.colspan
                        }
                        if(cell.style){
                            styleCell = {...cell.style}
                        }
                        let cellValue = ''
                        if(cell.field){
                            if(this.tableData){
                                cellValue = this.tableData[cell.field]
                                if(cell.format){
                                    cellValue = cell.format.replace('?',cellValue || '?')
                                }
                            }else{
                                cellValue = ''
                            }
                        }else{
                            if(cell.text){
                                const arrTextInline = cell.text.split('\n')                                
                                if(arrTextInline.length > 1){
                                    cellValue = arrTextInline.map((line,idx)=>
                                       <span>{ line } { idx < arrTextInline.length -1 && <br/>}</span>
                                    )
                                }else{
                                    cellValue = cell.text
                                }
                            }
                        }
                        return <td {...{attrs:attrsCell}} {...{style:styleCell}}>{cellValue}</td>
                    })
                }</tr>
            }) 
        })
        return (
            <div class="cv-widget cv-free-table" id={`cv-free-table_${this.id}`} style={ this.style }>
                {
                    this.template.header && <div class="cv-free-table-header" style={ this.template.header.style }><span>{ this.headerText }</span></div>
                }
                {
                    this.template.rowGroups.map((c,idx)=>{
                        let styleTable = {...this.template.tableStyle}
                        if(idx>0){
                            styleTable.borderTop='none'
                        }
                        return <table border="1" class="cv-free-table-content" style={styleTable}>{ grps[idx] }</table>
                    })
                }
                {
                    this.template.footer && <div class="cv-free-table-footer" style={ this.template.footer.style }><span>{ this.footerText }</span></div>
                }
            </div>
        )
    }
}
</script>