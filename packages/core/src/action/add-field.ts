// import { signal } from "@angular/core";
// import { ActionDef, ActionName } from "../types/actions";

// export interface AddColumnOptions {
//     type: ActionName.AddColumn;
//     data: {
//         id: string;
//         type: any;
//         name: string;
//     };
// }

// export const AddColumn: ActionDef<any, AddColumnOptions> = {
//     execute: (context, options) => {
//         const data = signal(context.data);
//         const newColumn = options.data;
//         data.update((value) => {
//             value.columns.push(newColumn);
//             value.rows = value.rows.map((item: any) => {
//                 const newCell = {
//                     [newColumn.id]: "",
//                 };
//                 return {
//                     id: item.id,
//                     value: {
//                         ...item.value,
//                         ...newCell,
//                     },
//                 };
//             });
//             return value;
//         });

//         return {
//             resourceType: "grid",
//             data: data(),
//             actions: options,
//         };
//     },
// };
