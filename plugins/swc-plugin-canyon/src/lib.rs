#![allow(clippy::not_unsafe_ptr_arg_deref)]

use swc_core::ecma::ast::Program;
use swc_core::ecma::transforms::testing::test_inline;
use swc_core::ecma::visit::as_folder;
use swc_core::plugin::plugin_transform;
use swc_core::plugin::proxies::TransformPluginProgramMetadata;
// use swc_coreswc_ecma_ast::Program;
// use swc_plugin_macro::plugin_transform;
use core_plugin_canyon::add;
#[plugin_transform]
fn plugin(program: Program, _: TransformPluginProgramMetadata) -> Program {
    // add(1,2);
    println!("{}", add(1,2));
    program
}
