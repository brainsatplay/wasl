import v000PluginSchema from '../../versions/0.0.0/plugin.schema.json' assert {type: 'json'}
import v000EdgesSchema from '../../versions/0.0.0/edges.schema.json' assert {type: 'json'}
import v000NodesSchema from '../../versions/0.0.0/nodes.schema.json' assert {type: 'json'}
import v000PortsSchema from '../../versions/0.0.0/ports.schema.json' assert {type: 'json'}
import v000PortSchema from '../../versions/0.0.0/port.schema.json' assert {type: 'json'}


export default {
    ['0.0.0']: {
        'nodes.schema.json': v000NodesSchema,
        'edges.schema.json': v000EdgesSchema,
        'plugin.schema.json': v000PluginSchema,
        'ports.schema.json': v000PortsSchema,
        'port.schema.json': v000PortSchema
    }
}