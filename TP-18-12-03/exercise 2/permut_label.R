permut_label<-function(centers,res_cluster_centers,res_cluster) 
{ 
  k<-dim(centers)[2]
  n<-length(res_cluster)
  clusters<-matrix(0,ncol=n)
  list_used_idx_init<-c()
  list_used_idx_new<-c()
  #permutation
  for (idx in (1:k)){
    int_sum<-colSums((res_cluster_centers[idx,] - centers) ^ 2)
    min_clust<-which.min(int_sum)
    if( !is.element(min_clust, list_used_idx_init) ){
      clusters[res_cluster==idx]<-min_clust
      list_used_idx_init<-c(list_used_idx_init,min_clust)
      list_used_idx_new<-c(list_used_idx_new,idx)
    }
  }
  if(length(list_used_idx_init)<k){
    missing_init<-which(!is.element((1:k),list_used_idx_init))
    missing_new<-which(!is.element((1:k),list_used_idx_new))
    for (idx in (1:length(missing_init))) {
      clusters[res_cluster==missing_new[idx]]<-missing_init[idx]
    }
  }
  return(clusters)
}
