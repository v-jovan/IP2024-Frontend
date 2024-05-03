import { Component, ViewEncapsulation } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-filter-menu',
  standalone: true,
  imports: [ButtonModule, TreeModule],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FilterMenuComponent {
  categories!: TreeNode[];
  treeExpanded = false;

  ngOnInit() {
    this.categories = [
      {
        label: 'U sali',
        children: [{ label: 'Sa loptom' }, { label: 'Sa spravama' }]
      },
      {
        label: 'Na terenu',
        children: [{ label: 'Sa loptom' }, { label: 'Sa spravama' }]
      }
    ];
  }

  toggleTree() {
    this.treeExpanded = !this.treeExpanded;
    this.setExpansion(this.categories, this.treeExpanded);
  }

  setExpansion(nodes: TreeNode[], expanded: boolean) {
    nodes.forEach((node) => {
      node.expanded = expanded;
      if (node.children) {
        this.setExpansion(node.children, expanded);
      }
    });
  }
}
